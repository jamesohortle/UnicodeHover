#!/usr/bin/env python3
# -*- coding: utf-8 -*
"""Process the Unicode Data for the extension."""
from __future__ import annotations
from typing import *

import re
import csv
import json
from pathlib import Path
from itertools import chain

import lxml.builder as builder
from lxml import etree as ET

# Check if UCD exists.
HERE = Path(__file__).parent
DATA = (HERE / ".." / "data").resolve()
NO_UNIHAN_XML = DATA / "ucd.nounihan.flat.xml"
UNIHAN_XML = DATA / "ucd.unihan.flat.xml"

if not NO_UNIHAN_XML.is_file():
    quit(
        "Run `wget https://www.unicode.org/Public/UCD/latest/ucdxml/ucd.nounihan.flat.zip && unzip ucd.nounihan.flat.zip` to get the XML file. (File sizes: .zip=912K; .xml: 51M.)"
    )
elif not UNIHAN_XML.is_file():
    quit(
        "Run `wget https://www.unicode.org/Public/UCD/latest/ucdxml/ucd.unihan.flat.zip && unzip ucd.unihan.flat.zip` to get the XML file. (File sizes: .zip=6.1M; .xml: 40M.)"
    )

# Define tags for the XML.
elt = builder.ElementMaker(namespace="http://www.unicode.org/ns/2003/ucd/1.0")
char_tag = elt.char().tag

# # Define Unihan ranges.
# UNIHAN_LO = 0x4E00
# UNIHAN_HI = 0x9FFF
# UNIHAN_EXT_A_LO = 0x3400
# UNIHAN_EXT_A_HI = 0x4DBF
# UNIHAN_EXT_B_LO = 0x20000
# UNIHAN_EXT_B_HI = 0x2A6DF
# UNIHAN_EXT_C_LO = 0x2A700
# UNIHAN_EXT_C_HI = 0x2B73F
# UNIHAN_EXT_D_LO = 0x2B740
# UNIHAN_EXT_D_HI = 0x2B81F

# Get data for Tangut.
TANGUT_TSV = DATA / "tangutdb-4-0.tsv"
if not TANGUT_TSV.is_file():
    quit(
        "Run `wget http://www.amritas.com/Tangut/tangutdb-4-0.xls` to get the XLS file (.xls=2.1M). Convert it to a .tsv before proceeding."
    )

# Read and store the Tangut data.
with TANGUT_TSV.open(mode="r", encoding="utf-8") as tangut_tsv:
    tangut_data = csv.DictReader(tangut_tsv, delimiter="\t")

    # Store a Dict[hex_code, pronunciation]. (Remove the `U+` at the start of the hex codes.)
    tangut_pronunciations = {
        (data["Unicode"][2:]): data["Complex"] for data in tangut_data
    }


def get_alias(char_elt: ET.Element) -> str:
    aliases: List[str] = []
    for tag in char_elt.getchildren():
        aliases.append(tag.get("alias"))
    aliases = sorted(aliases, key=lambda a: len(a), reverse=True)
    return aliases[0].title() + " (alias)"


ideograph_octothorpe = re.compile(r"#$")


def yield_non_unihan(
    path: Path = NO_UNIHAN_XML,
) -> Generator[Tuple[int, str], None, None]:
    """Parse non-Unihan data."""
    _path = str(path.resolve())
    chars = ET.iterparse(_path, tag=char_tag, recover=True, huge_tree=True)
    for _, char in chars:
        codepoint = char.get("cp")
        if not codepoint:
            continue
        block = char.get("blk")
        if block == "Nushu":
            _name = ideograph_octothorpe.sub(codepoint, char.get("na")).title()
            reading = char.get("kReading", "")
            nushu_duben = "(NǚshūDūběn: " + (char.get("kSrc_NushuDuben", "?")) + ")"
            name = " ".join((_name, reading, nushu_duben))
        elif block == "Tangut":
            _name = ideograph_octothorpe.sub(codepoint, char.get("na")).title()
            tangut_source = "(" + (char.get("kTGT_MergedSrc", "?")) + ")"
            name = " ".join(
                (
                    _name,
                    tp
                    if (tp := tangut_pronunciations.get(codepoint, "(pron. unknown)"))
                    != "?"
                    else "(pron. uncertain)",  # Walrus operator in the wild!
                    tangut_source,
                )
            )
        elif block == "Khitan_Small_Script":
            name = ideograph_octothorpe.sub(codepoint, char.get("na")).title()
        else:
            name = (char.get("na") or char.get("na1")).title() or get_alias(char)
        yield (int(codepoint, base=16), name)


def yield_unihan(path: Path = UNIHAN_XML) -> Generator[Tuple[int, str], None, None]:
    """Parse Unihan data."""
    _path = str(path.resolve())
    unihan = ET.iterparse(_path, tag=char_tag, recover=True, huge_tree=True)
    for _, char in unihan:
        codepoint = char.get("cp")
        name = (char.get("kDefinition") or "(No description)") + " (Unified CJK)"
        name_parts = name.split()
        name = " ".join(  # Account for non-alphabetic first char. Cf.: U+3400.
            [name_parts[0].title()] + name_parts[1:]
        )
        yield (int(codepoint, base=16), name)


# Define JSON outfile.
JSON_OUT = DATA / "unicode_data.json"

if __name__ == "__main__":
    # Order the data by codepoint.
    unicode_data = {
        codepoint: desc for codepoint, desc in chain(yield_non_unihan(), yield_unihan())
    }

    # Dump to JSON.
    with JSON_OUT.open(mode="w", encoding="utf-8") as json_out:
        json.dump(unicode_data, json_out, indent="\t", sort_keys=True)

