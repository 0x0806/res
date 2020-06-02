function get-destbytype($ext) {
 Switch ($ext)
 {
  {$ext -match '(jpg|png|gif)'} { "images" }
  {$ext -match '(txt|docx)'} { "docs" }
  default {"$ext" }
 }
}

ls $dirtyfolder/* | ? {!$_.PSIsContainer} | %{
  $dest = "$($org)ORG\$(get-destbytype $_.extension)"
  if (! (Test-Path -path $dest ) ) {
    new-item $dest -type directory
  }
  mv -path $_.fullname -destination $dest 
}
