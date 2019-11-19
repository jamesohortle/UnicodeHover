package com.jamesohortle.unicodehover;

/**
 * Test in comments
 * U+0000 \u0000 -> Null 
 * U+0020\uu0020 ->  Space 
 * U+0080\uuu0080 -> Padding Character (alias) 
 * U+1234\uuuu1234 -> ሴ Ethiopic Syllable See 
 * U+0B87\uuuuu0b87 -> இ Tamil Letter I 
 * U+0FDA \u0fda -> ࿚ Tibetan Mark Trailing Mchan Rtags 
 * U+32FF\u32ff -> ㋿ Square Era Name Reiwa
 * U+50B7\u50B7 -> 傷 Wound, injury; fall ill from (Unified CJK)
 * U+17000 \uD81C\uDC00 -> 𗀀 Tangut Ideograph 1do1 (L2008-0008)
 * U+1B2C7 \uuD82C\uuDEC7 -> 𛋇 Nushu Character tang13 (NǚshūDūběn: 53.06)
 * U+2B86F\uuuD86E\uuuDC6F -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]
 * U+1F639 \uuuuD83D\uuuuDE39 -> 😹 Cat Face with Tears of Joy
 */
public class Main {

    /**
     * Test the Unicode escapes.
     */
    public static void main(String args[]) {
        final String testString = '''
            U+0000 \u0000 -> Null 
            U+0020\uu0020 ->  Space 
            U+0080\uuu0080 -> Padding Character (alias) 
            U+1234\uuuu1234 -> ሴ Ethiopic Syllable See 
            U+0B87\uuuuu0b87 -> இ Tamil Letter I 
            U+0FDA \u0fda -> ࿚ Tibetan Mark Trailing Mchan Rtags 
            U+32FF\u32ff -> ㋿ Square Era Name Reiwa
            U+50B7\u50B7 -> 傷 Wound, injury; fall ill from (Unified CJK)
            U+17000 \uD81C\uDC00 -> 𗀀 Tangut Ideograph 1do1 (L2008-0008)
            U+1B2C7 \uuD82C\uuDEC7 -> 𛋇 Nushu Character tang13 (NǚshūDūběn: 53.06)
            U+2B86F\uuuD86E\uuuDC6F -> 𫡯 (No description) (Unified CJK) [This is Vietnamese Chữ Nôm, no UCD.]
            U+1F639 \uuuuD83D\uuuuDE39 -> 😹 Cat Face with Tears of Joy
        '''
    }
}