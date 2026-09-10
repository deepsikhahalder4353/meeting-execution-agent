Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile("test-meeting.wav")
$synth.Speak("Hello team. We agreed to finalize the offline sync specification today. Marcus will deploy the update to staging by Friday.")
$synth.Dispose()
Write-Output "Generated test-meeting.wav with size: $((Get-Item test-meeting.wav).Length) bytes"
