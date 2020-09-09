module Main where

import Lib ()

main :: IO ()
{-
 - U+0000 -> Null.
 - U+0020 ->  Space.
 - U+1234 -> ሴ Ethiopic Syllable See.
 - U+0B87 -> இ Tamil Letter I.
 - U+0FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
 - U+50B7 -> 傷 Ideograph wound, injury; fall ill from CJK.
 - U+1F639 -> 😹 Cat Face with Tears of Joy.
-}

main =
  -- Decimal, hexadecimal and octal escapes.
  putStrLn "\1234 \xbeef \o1234"

  -- Hexadecimal escapes.
  putStrLn "\
    \x0000 \x0000 \x00000000 -> Null\
    \x0020\x0020\x00000020 ->  Space\
    \x0080\x0080\x00000080 -> Padding Character (alias)\
    \x1234 \x1234\x00001234 -> ሴ Ethiopic Syllable See\
    \x0B87\x0b87 \x00000b87 -> இ Tamil Letter I\
    \x0FDA \x0fda \x00000FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags\
    \x32FF\x32ff\x000032FF -> ㋿ Square Era Name Reiwa\
    \x50B7\x50B7\x000050B7 -> 傷 Wound, injury; fall ill from (Unified CJK)\
    \x17000     \x00017000 -> 𗀀 Tangut Ideograph 1do1 (L2008-0008)\
    \x1B2C7     \x0001b2c7 -> 𛋇 Nushu Character tang13 (NǚshūDūběn: 53.06)\
    \x2B86F     \x0002B86F -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]\
    \x1F639     \x0001f639 -> 😹 Cat Face with Tears of Joy\
    \x08BE\x08BE\x000008BE -> ࢾ Arabic Letter Peh with Small V\
    \x10E80     \x00010E80 -> 𐺀 Yezidi Letter Elif\
    \x11900     \x00011900 -> 𑤀 Dives Akuru Letter A\
    \x18B01     \x00018B01 -> 𘬁 Khitan Small Script Character-18b01\
    \x10FB0     \x00010FB0 -> 𐾰 Chorasmian Letter Aleph\
    \x1FAC0     \x0001FAC0 -> 🫀 Anatomical Heart\
    \x1FBB2\x1FBB3\
    \130\&11"
  
  -- Single character escapes.
  putStrLn "\
    \0	U+0000	null character
    \a	U+0007	alert
    \b	U+0008	backspace
    \f	U+000C	form feed
    \n	U+000A	newline (line feed)
    \r	U+000D	carriage return
    \t	U+0009	horizontal tab
    \v	U+000B	vertical tab
    \"	U+0022	double quote
    \&	n/a	empty string
    \'	U+0027	single quote
    \\	U+005C	backslash"

  -- ASCII control code abbreviations
  putStrLn "\
    \NUL	U+0000	null character
    \SOH	U+0001	start of heading
    \STX	U+0002	start of text
    \ETX	U+0003	end of text
    \EOT	U+0004	end of transmission
    \ENQ	U+0005	enquiry
    \ACK	U+0006	acknowledge
    \BEL	U+0007	bell
    \BS	U+0008	backspace
    \HT	U+0009	horizontal tab
    \LF	U+000A	line feed (newline)
    \VT	U+000B	vertical tab
    \FF	U+000C	form feed
    \CR	U+000D	carriage return
    \SO	U+000E	shift out
    \SI	U+000F	shift in
    \DLE	U+0010	data link escape
    \DC1	U+0011	device control 1
    \DC2	U+0012	device control 2
    \DC3	U+0013	device control 3
    \DC4	U+0014	device control 4
    \NAK	U+0015	negative acknowledge
    \SYN	U+0016	synchronous idle
    \ETB	U+0017	end of transmission block
    \CAN	U+0018	cancel
    \EM	U+0019	end of medium
    \SUB	U+001A	substitute
    \ESC	U+001B	escape
    \FS	U+001C	file separator
    \GS	U+001D	group separator
    \RS	U+001E	record separator
    \US	U+001F	unit separator
    \SP	U+0020	space
    \DEL	U+007F	delete"

  -- Control with character escapes
  putStrLn "\
    \^@	U+0000	null character
    \^A through \^Z	U+0001 through U+001A	control codes
    \^[	U+001B	escape
    \^\	U+001C	file separator
    \^]	U+001D	group separator
    \^^	U+001E	record separator
    \^_	U+001F	unit separator"