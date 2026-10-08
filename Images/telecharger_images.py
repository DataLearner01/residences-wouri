#!/usr/bin/env python3
"""
Télécharge des photos haute résolution de maisons, immeubles et quartiers du
Cameroun depuis Wikimedia Commons (licences libres uniquement) et écrit un
fichier CREDITS.csv avec l'auteur et la licence de chaque photo.

Utilisation (Windows, PowerShell ou Invite de commandes) :
    cd "D:\\Claude Code\\residences-wouri\\Images"
    python telecharger_images.py

Options :
    --count 30      nombre de photos voulues (défaut 30)
    --out DOSSIER   dossier de destination (défaut : le dossier du script)

Aucune installation nécessaire : seul Python 3 est requis.
Les photos viennent de Wikimedia Commons : vérifiez-les à l'oeil avant
de les utiliser, la recherche automatique peut en ramener quelques-unes
qui ne conviennent pas (cartes, intérieurs, foules...).
"""
import argparse
import csv
import html
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
# Wikimedia demande d'identifier le programme. Vous pouvez ajouter votre email ici.
USER_AGENT = "ResidencesWouriDemo/1.0 (projet portfolio personnel; python-urllib)"

MIN_WIDTH = 1920   # largeur minimale de l'original
MIN_HEIGHT = 1000
TARGET_WIDTH = 1920  # largeur téléchargée (taille standard Wikimedia)

QUERIES = [
    "Douala house",
    "Douala building",
    "Yaoundé house",
    "Yaoundé building",
    "Cameroon villa",
    "Cameroon house",
    "Cameroon housing",
    "Cameroon architecture",
    "Kribi house",
    "Limbe Cameroon building",
    "Buea house",
    "Bafoussam",
    "Bamenda house",
    "Bamileke chiefdom",
    "Musgum house",
    "Foumban",
    "Maroua house",
    "Garoua building",
]

KEYWORDS = [
    "cameroon", "cameroun", "douala", "yaound", "kribi", "limbe", "limb\u00e9",
    "buea", "bafoussam", "bamenda", "foumban", "maroua", "garoua", "bertoua",
    "edea", "ed\u00e9a", "bamileke", "bamil\u00e9k\u00e9", "musgum", "nkongsamba",
]

BAD_WORDS = [
    "map", "carte", "flag", "drapeau", "logo", "coat of arms", "portrait",
    "stamp", "diagram", "locator", "football", "match", "election", "poster",
    "screenshot", "interior", "int\u00e9rieur", "market", "march\u00e9",
]

GOOD_LICENSES = ("cc by", "cc0", "pd", "public domain")


def api(params, retries=4):
    params = dict(params)
    params["format"] = "json"
    params["formatversion"] = "2"
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait = int(e.headers.get("Retry-After", "5"))
                time.sleep(min(wait, 30))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("API Commons injoignable : " + url)


def search(query, limit=50):
    data = api({
        "action": "query",
        "generator": "search",
        "gsrsearch": query + " filetype:bitmap",
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": str(TARGET_WIDTH),
        "iiextmetadatafilter": "Artist|LicenseShortName|LicenseUrl|Categories|ImageDescription",
    })
    pages = data.get("query", {}).get("pages", [])
    pages.sort(key=lambda p: p.get("index", 0))
    return pages


def meta(info, key):
    return html.unescape(re.sub(r"<[^>]+>", "", (info.get("extmetadata", {}).get(key, {}) or {}).get("value", ""))).strip()


def accept(page):
    """Retourne True si la page est une photo exploitable (licence, taille, sujet)."""
    infos = page.get("imageinfo") or []
    if not infos:
        return False
    info = infos[0]
    if info.get("mime") != "image/jpeg":
        return False
    if info.get("width", 0) < MIN_WIDTH or info.get("height", 0) < MIN_HEIGHT:
        return False
    licence = meta(info, "LicenseShortName").lower()
    if not licence.startswith(GOOD_LICENSES):
        return False
    title = page.get("title", "").lower()
    if any(w in title for w in BAD_WORDS):
        return False
    text = " ".join([title, meta(info, "Categories"), meta(info, "ImageDescription")]).lower()
    return any(k in text for k in KEYWORDS)


def slug(title):
    t = re.sub(r"^file:", "", title, flags=re.I)
    t = re.sub(r"\.[a-z]{3,4}$", "", t, flags=re.I)
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return t[:60] or "photo"


def download(url, dest):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            if len(data) < 30_000:
                return False
            with open(dest, "wb") as f:
                f.write(data)
            return True
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                time.sleep(min(int(e.headers.get("Retry-After", "5")), 30))
                continue
            return False
        except (urllib.error.URLError, TimeoutError):
            time.sleep(2 * (attempt + 1))
    return False


def interleave(lists):
    """Alterne les résultats de chaque recherche pour varier les villes et les styles."""
    seen, out = set(), []
    longest = max((len(l) for l in lists), default=0)
    for i in range(longest):
        for l in lists:
            if i < len(l) and l[i]["title"] not in seen:
                seen.add(l[i]["title"])
                out.append(l[i])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=30)
    ap.add_argument("--out", default=os.path.dirname(os.path.abspath(__file__)))
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    print("Recherche sur Wikimedia Commons...")
    results = []
    for q in QUERIES:
        try:
            pages = [p for p in search(q) if accept(p)]
        except Exception as e:  # une requête qui échoue ne bloque pas les autres
            print("  ! %s : %s" % (q, e))
            pages = []
        print("  %-28s %2d photo(s) retenue(s)" % (q, len(pages)))
        results.append(pages)
        time.sleep(0.5)

    candidates = interleave(results)
    print("%d photos candidates au total.\n" % len(candidates))

    rows, n = [], 0
    for page in candidates:
        if n >= args.count:
            break
        info = page["imageinfo"][0]
        url = info.get("thumburl") or info["url"]
        name = "%02d_%s.jpg" % (n + 1, slug(page["title"]))
        dest = os.path.join(args.out, name)
        print("[%02d/%d] %s" % (n + 1, args.count, name))
        if download(url, dest):
            n += 1
            rows.append([
                name,
                re.sub(r"^File:", "", page["title"]),
                meta(info, "Artist"),
                meta(info, "LicenseShortName"),
                meta(info, "LicenseUrl"),
                info.get("descriptionurl", ""),
                info.get("width", ""),
                info.get("height", ""),
            ])
        time.sleep(1)

    with open(os.path.join(args.out, "CREDITS.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["fichier", "titre", "auteur", "licence", "lien_licence", "page_source", "largeur_originale", "hauteur_originale"])
        w.writerows(rows)

    print("\nTerminé : %d photo(s) dans %s" % (n, args.out))
    print("Crédits (auteur + licence) : CREDITS.csv")
    if n < args.count:
        print("Moins de photos que demandé : relancez avec d'autres mots-clés dans QUERIES.")
    print("Pensez à afficher les crédits sur le site (pied de page « Crédits photos »).")


if __name__ == "__main__":
    sys.exit(main())
