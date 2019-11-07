/** test.js
 * Test UnicodeHover.
 */


// In comments.
// U+0000 -> Null.
// U+0020 ->  Space.
// U+1234 -> ሴ Ethiopic Syllable See.
// U+0B87 -> இ Tamil Letter I.
// U+0FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
// U+50B7 -> 傷 Ideograph wound, injury; fall ill from CJK
// U+1F639 -> 😹 Cat Face with Tears of Joy.

// In strings.
"U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639"
'U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639'
"\u0000\u0020\u1234\u0B87\u0FDA\u50B7"
'\u0000\u0020\u1234\u0B87\u0FDA\u50B7'
"\U00000000\U00000020\U00001234\U00000B87\U00000FdA\U000050B7\U0001F639"
'\U00000000\U00000020\U00001234\U00000B87\U00000FdA\U000050B7\U0001F639'


// In multiline strings.
`
U+0000 \u0000 \U00000000 -> Null.
U+0020\u0020\U00000020 -> Space.
U+1234 \u1234\U00001234 -> ሴ Ethiopic Syllable See.
U+0B87\u0b87 \U00000b87 -> இ Tamil Letter I.
U+0FDA \u0fda \U00000FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
U+50B7\u50B7\U000050B7 -> 傷 Ideograph wound, injury; fall ill from CJK
U+1F639 \U0001f639 -> 😹 Cat Face with Tears of Joy.
`

