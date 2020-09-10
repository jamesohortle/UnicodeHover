<p align="center">
    <img src="./img/icon.png" width=150 height=150 alt-text="UnicodeHover icon"/>
</p>

# UnicodeHover

![Demo of UnicodeHover](./img/demo.gif)

[![CircleCI](https://circleci.com/gh/jamesohortle/UnicodeHover/tree/master.svg?style=svg&circle-token=3e37509dd484de97a96efe5931aa37f689a09c15)](https://circleci.com/gh/jamesohortle/UnicodeHover/tree/master)

UnicodeHover lets you see a glyph of the character represented by a Unicode escape. Let's say you have a regex to remove all non-printable characters, such as `DEL`.

```python
unprintables = re.compile(r"[\u0000-\u001f]")
```

Or perhaps your coworkers don't have the necessary fonts to display glyphs and have used escapes so that their editors don't show them [_mojibake_](https://en.wikipedia.org/wiki/Mojibake) or � (`U+FFFD`).

Maybe your favourite language doesn't even support Unicode literals in source files after a certain version ([looking at you, Haskell](https://gitlab.haskell.org/ghc/ghc/-/issues/15525)) so you have to represent them with an escape.

In any case, it would be handy to immediately have information on the characters being processed instead of, e.g., going to an external website and searching for the codepoint.

## Usage/Features

Simply place your cursor over the escape sequence and a panel will hover over it, showing you the glyph in question.

- Recognizes the code points as used by the Unicode Consortium (`U+` followed by 4 to 6 hexadecimal digits) in any file.
- Recognizes Unicode escape sequences in Python, JavaScript (TypeScript), TeX (LaTeX), Java, HTML, CSS and Haskell files.
- Renders a glyph of the character using a system font (see [Requirements](#requirements)).
- Provides a one-line description of the character in English.
- Provides a link to the [Unicode Table](https://unicode-table.com) page (no affiliation) for the character for further information.

## Requirements

- Works on Python, JavaScript, TypeScript, TeX, LaTeX, Java, HTML, CSS and Haskell files.
    - Language support needs to be installed if it does not come default in VS Code.
    - [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
    - [Haskell for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=haskell.haskell)
- Needs a system font that defines a glyph for the character to be displayed.

## Known Issues

Pull requests (in particular for new languages) are welcome.

- Non-printable characters, by definition, do not normally have glyphs associated with them and so usually no glpyhs will be displayed. However, the description and link will still be shown. If a font somewhere on your system defines a glyph for a non-printable character, it will be displayed.

## Release Notes

See the [changelog](CHANGELOG.md).

## Data sources

The data for this project were taken from the [Unicode Consortium](https://home.unicode.org/)'s [Unicode Data](https://www.unicode.org/Public/UCD/latest/) collection. The data follows their licensing (cf.: [terms of use](http://www.unicode.org/terms_of_use.html)).

The pronunciations for Tangut are from [Tangut database v4.0](http://www.amritas.com/Tangut/tangutdb-4-0.xls) and are the work of Marc Miyake, used here with his permission.

## License

This extension is intended to be used by any- and everyone. It uses the [MIT License](https://github.com/jamesohortle/UnicodeHover/blob/master/LICENSE.txt).

## About the icon

The character in the icon is `U+1234 ETHIOPIC SYLLABLE SEE`, which is part of the Geʽez script used for several Ethiopic languages, in particular Amharic. Although `SEE` is most likely pronounced `seː`, it represents the idea that you can "see" glyphs as easily as 1, 2, 3(, 4). It also just looks pretty!

Thanks to Misato Inoue for design help with the icon!
