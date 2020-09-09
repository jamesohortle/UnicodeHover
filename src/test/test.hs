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
 - \0000
-}

main =
  putStrLn "\0000"