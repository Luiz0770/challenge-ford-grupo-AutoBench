"""Adiciona "platform" a cada veiculo de data/vehicles/*.json.

Insercao textual logo apos a linha "categoryId" (preserva CRLF e formatacao).
Uso:  python scripts/add-platform.py [--dry-run]
Regra: monobloco por padrao; chassi sobre longarinas para os modelos em CHASSI.
"""
import glob
import io
import json
import re
import sys

CHASSI = {
    ("Chevrolet", "S10"),
    ("Ford", "Ranger"),
    ("Toyota", "Hilux"),
    ("Volkswagen", "Amarok"),
    ("Jeep", "Wrangler"),
}

DRY = "--dry-run" in sys.argv
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


def field(lines, start, key):
    for line in lines[start : start + 8]:
        m = re.match(r'\s*"%s":\s*"(.*)",?\s*$' % key, line)
        if m:
            return m.group(1)
    raise SystemExit(f"campo {key} nao encontrado perto da linha {start}")


total = {"mono": 0, "chassi": 0}
for path in sorted(glob.glob("data/vehicles/*.json")):
    with open(path, "r", encoding="utf-8", newline="") as f:
        text = f.read()
    nl = "\r\n" if "\r\n" in text else "\n"
    lines = text.split(nl)
    out = []
    for i, line in enumerate(lines):
        out.append(line)
        m = re.match(r'(\s*)"categoryId":', line)
        if not m:
            continue
        if '"platform"' in lines[i + 1]:
            raise SystemExit(f"{path}: platform ja existe (script ja rodou?)")
        brand = field(lines, i, "brand")
        model = field(lines, i, "model")
        plat = "chassi" if (brand, model) in CHASSI else "mono"
        total[plat] += 1
        out.append(f'{m.group(1)}"platform": "{plat}",')
    new = nl.join(out)
    json.loads(new)  # garante JSON valido
    if not DRY:
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(new)
print("mono:", total["mono"], "chassi:", total["chassi"], "(dry-run)" if DRY else "")
