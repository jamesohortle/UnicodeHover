/** test.js
 * Test UnicodeHover.
 */

// tslint:disable: no-unused-expression


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
"U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639";
'U+0000U+0020U+1234U+0B87U+0FDAU+50B7U+1F639U+1F639';

// Octal form.
"\041\377"; // "!ÿ"

// Hex form.
"\x21\xff"; // "!ÿ"

// Short form.
"\u0000\u0020\u1234\u0B87\u0FDA\u50B7";
'\u0000\u0020\u1234\u0B87\u0FDA\u50B7';

// Long form.
"\u{00000000}\u{00000020}\u{00001234}\u{00000B87}\u{00000FdA}\u{000050B7}\u{0001F639}";
'\u{00000000}\u{00000020}\u{00001234}\u{00000B87}\u{00000FdA}\u{000050B7}\u{0001F639}';


// In multiline strings.
`
U+0000 \u0000 \u{0} -> Null
U+0020\u0020\{00000020} ->  Space
U+0080\u0080\u{00000080} -> Padding Character (alias)
U+1234 \u1234\u{00001234} -> ሴ Ethiopic Syllable See
U+0B87\u0b87 \u{00000b87} -> இ Tamil Letter I
U+0FDA \u0fda \u{00000FDA} -> ࿚ Tibetan Mark Trailing Mchan Rtags
U+32FF\u32ff\u{000032FF} -> ㋿ Square Era Name Reiwa
U+50B7\u50B7\u{000050B7} -> 傷 Wound, injury; fall ill from (Unified CJK)
U+17000     \u{00017000} -> 𗀀 Tangut Ideograph 1do1 (L2008-0008)
U+1B2C7     \u{0001b2c7} -> 𛋇 Nushu Character tang13 (NǚshūDūběn: 53.06)
U+2B86F     \u{0002B86F} -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]
U+1F639 \u{0001f639} -> 😹 Cat Face with Tears of Joy
\041\xff\x21\377
`;

(<body>
    {/* Example taken shamelessly from: https://www.w3.org/International/questions/qa-escapes */}
    {/* Raw text. */}
    <p lang="cs">Jako efektivnější se nám jeví pořádání tzv. Road Show prostřednictvím
    našich autorizovaných dealerů v Čechách a na Moravě, které proběhnou v průběhu září
      a října.</p>
    {/* Hex-escaped. */}
    <p lang="cs">Jako efektivn&#x115;j&#x161;&#xED; se n&#xE1;m jev&#xED;
    po&#x159;&#xE1;d&#xE1;n&#xED; tzv. Road Show prost&#x159;ednictv&#xED;m na&#x161;ich
    autorizovan&#xFD;ch dealer&#x16F; v &#x10C;ech&#xE1;ch a na Morav&#x11B;, kter&#xE9;
      prob&#x11B;hnou v pr&#x16F;b&#x11B;hu z&#xE1;&#x159;&#xED; a &#x159;&#xED;jna.</p>
    {/* Dec-escaped. */}
    <p lang="cs"> Jako efektivn&#277;j&#353;&#237; se n&#225;m jev&#237;
    po&#345;&#225;d&#225;n&#237; tzv. Road Show prost&#345;ednictv&#237;m na&#353;ich
    autorizovan&#253;ch dealer&#367; v &#268;ech&#225;ch a na Morav&#283;, kter&#233;
    prob&#283;hnou v pr&#367;b&#283;hu z&#225;&#345;&#237; a &#345;&#237;jna.
    </p>
    {/* Named entities. */}
    <p lang="cs"> Jako efektivn&#x115;j&scaron;&iacute; se n&aacute;m jev&iacute;
    po&rcaron;&aacute;d&aacute;n&iacute; tzv. Road Show prost&rcaron;ednictv&iacute;m na&scaron;ich
    autorizovan&yacute;ch dealer&uring; v &Ccaron;ech&aacute;ch a na Morav&ecaron;, kter&eacute;
    prob&ecaron;hnou v pr&uring;b&ecaron;hu z&aacute;&rcaron;&iacute; a &rcaron;&iacute;jna.
    </p>
    {/* Named entities with multiple code points. */}
    <p>&NotSquareSuperset;&NotRightTriangleBar;&NotEqualTilde;&NotGreaterFullEqual;&NotHumpDownHump;
      &fjlig;</p>
</body>);
