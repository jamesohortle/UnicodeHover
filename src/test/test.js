/** test.js
 * Test UnicodeHover.
 */


// In comments.
// U+0000 -> Null.
// U+0020 ->  Space.
// U+1234 -> ሴ Ethiopic Syllable See.
// U+0B87 -> இ Tamil Letter I.
// U+0FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
// U+50B7 -> 傷 Ideograph wound, injury; fall ill from CJK.
// U+1F639 -> 😹 Cat Face with Tears of Joy.

/** In multiline comments
 * U+0000 -> Null.
 * U+0020 ->  Space.
 * U+1234 -> ሴ Ethiopic Syllable See.
 * U+0B87 -> இ Tamil Letter I.
 * U+0FDA -> ࿚ Tibetan Mark Trailing Mchan Rtags.
 * U+50B7 -> 傷 Ideograph wound, injury; fall ill from CJK.
 * U+1F639 -> 😹 Cat Face with Tears of Joy.
 */

// In strings.
// Consortium form.
"U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639"
'U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639'

// Octal form.
"\041\377" // "!ÿ"

// Hex form.
"\x21\xff" // "!ÿ"

// Short form.
"\u0000\u0020\u1234\u0B87\u0FDA\u50B7"
'\u0000\u0020\u1234\u0B87\u0FDA\u50B7'

// Long form.
"\u{00000000}\u{00000020}\u{00001234}\u{00000B87}\u{00000FdA}\u{000050B7}\u{0001F639}"
'\u{00000000}\u{00000020}\u{00001234}\u{00000B87}\u{00000FdA}\u{000050B7}\u{0001F639}'


    // In multiline strings.
    `
U+0000 \u0000 \u{0} -> Null.
U+0020\u0020\u{020} -> Space.
U+1234 \u1234\u{00001234} -> ሴ Ethiopic Syllable See.
U+0B87\u0b87 \u{00000b87} -> இ Tamil Letter I.
U+0FDA \u0fda \u{00000FDA} -> ࿚ Tibetan Mark Trailing Mchan Rtags.
U+50B7\u50B7\u{000050B7} -> 傷 Ideograph wound, injury; fall ill from CJK.
U+1F639 \u{001f639} -> 😹 Cat Face with Tears of Joy.
\041\xff\x21\377
`

