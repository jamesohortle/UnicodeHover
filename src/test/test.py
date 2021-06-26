#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test UnicodeHover."""

# In comments.
# U+0000 -> Null.
# U+0020 ->  Space.
# U+1234 -> ሴ Ethiopic Syllable See.
# U+0B87 -> இ Tamil Letter I.
# U+0FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
# U+50B7 -> 傷 Ideograph wound, injury; fall ill from CJK.
# U+1F639 -> 😹 Cat Face with Tears of Joy.

# In strings.
"U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639"
"\u0000\u0020\u1234\u0B87\u0FDA\u50B7"
"\U00000000\U00000020\U00001234\U00000B87\U00000FdA\U000050B7\U0001F639"
# fmt: off
'U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639'
'\u0000\u0020\u1234\u0B87\u0FDA\u50B7'
'\U00000000\U00000020\U00001234\U00000B87\U00000FdA\U000050B7\U0001F639'
# fmt: on

# In multiline strings.
"""
U+0000 \u0000 \U00000000 -> Null
U+0020\u0020\U00000020 ->  Space
U+0080\u0080\U00000080 -> Padding Character (alias)
U+1234 \u1234\U00001234 -> ሴ Ethiopic Syllable See
U+0B87\u0b87 \U00000b87 -> இ Tamil Letter I
U+0FDA \u0fda \U00000FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags
U+32FF\u32ff\U000032FF -> ㋿ Square Era Name Reiwa
U+50B7\u50B7\U000050B7 -> 傷 Wound, injury; fall ill from (Unified CJK)
U+17000     \U00017000 -> 𗀀 Tangut Ideograph-17000 1do1 (L2008-0008)
U+1B2C7     \U0001b2c7 -> 𛋇 Nushu Character-1B2C7 tang13 (NǚshūDūběn: 53.06)
U+2B86F     \U0002B86F -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]
U+1F639     \U0001f639 -> 😹 Cat Face with Tears of Joy
U+08BE\u08BE\U000008BE -> ࢾ Arabic Letter Peh with Small V
U+10E80     \U00010E80 -> 𐺀 Yezidi Letter Elif
U+11900     \U00011900 -> 𑤀 Dives Akuru Letter A
U+18B01     \U00018B01 -> 𘬁 Khitan Small Script Character-18B01
U+10FB0     \U00010FB0 -> 𐾰 Chorasmian Letter Aleph
U+1FAC0     \U0001FAC0 -> 🫀 Anatomical Heart
U+1FBB2U+1FBB3
"""
# fmt: off
'''
U+0000 \u0000 \U00000000 -> Null
U+0020\u0020\U00000020 ->  Space
U+0080\u0080\U00000080 -> Padding Character (alias)
U+1234 \u1234\U00001234 -> ሴ Ethiopic Syllable See
U+0B87\u0b87 \U00000b87 -> இ Tamil Letter I
U+0FDA \u0fda \U00000FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags
U+32FF\u32ff\U000032FF -> ㋿ Square Era Name Reiwa
U+50B7\u50B7\U000050B7 -> 傷 Wound, injury; fall ill from (Unified CJK)
U+17000     \U00017000 -> 𗀀 Tangut Ideograph 1do1 (L2008-0008)
U+1B2C7     \U0001b2c7 -> 𛋇 Nushu Character tang13 (NǚshūDūběn: 53.06)
U+2B86F     \U0002B86F -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]
U+1F639     \U0001f639 -> 😹 Cat Face with Tears of Joy
'''
# fmt: on

# "\UFFFFFFFF"  # � (Too big) [MyPy etc. will throw errors]
"U+0080"
"U+0081"
"U+0084"
"U+0099"
"U+FFF9"
"U+FFFA"
"U+FFFB"
"U+1B2C7"
"U+17000"
"U+1F706"
"U+1F707"
"U+11BF"
"U+0353"
"U+32FF"
"U+5427"
"U+2B86F"
"U+3233"
"U+07C0"
"U+3400"

# Test possible markdown rendering errors.
"\u002d"
"\u002b"
"\u0023"
"\u002a"
"\u005f"
"\u007e"
"\u0029"
"\u005b"
"\u005c"
"\u005d"
"\u0028"
"\u0021"
"\u0060"
"\u007c"
"\u003e"
