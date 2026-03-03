---
title: Encoding for the 21st century
summary: "Encoding for the 21st century: JPEGXL and Opus"
ogType: "article"
date: 2026-03-25
---

# Encoding for the 21st century: JPEGXL and Opus

In the last few days I have been moving pictures and music to my  [self-hosted setup](./self_hosting.md). How do I compress my files so to get as much quality as possible without breaking the bank on storage? Encode pictures with JPEGXL and music with Opus.

## JPEGXL: a better, smaller JPEG

First things first, JPEGXL is [fully open-source](http://github.com/libjxl/libjxl) with a BSD-3 license and standardised through the international standard [ISO/IEC 18181](https://cdn.standards.iteh.ai/samples/77977/0bcf6c421b67481397ad6aa14a8b1afb/ISO-IEC-18181-1-2022.pdf).

Second thing, my choice of JPEGXL is strictly based on my needs. I wanted to develop the RAW files coming from my camera into a small but high-quality format for storage. This means I do not take into account encoding/decoding speed and other factors relevant for hardware/software applications (see [HALIC](https://github.com/Hakan-Abbas/HALIC-High-Availability-Lossless-Image-Compression) for example).

Why I chose JPEGXL:

- up to 55% smaller than JPG and up to 25% smaller than [AVIF](https://aomedia.org/specifications/avif/) (an image format which encodes pictures as a single [AV1](https://aomedia.org/specifications/av1/) frame) with a focus on visually lossless compression. You get a smaller photo without losing perceptual quality;
- lossless JPEG transcoding. You can transcode a JPEG image for an average 20% saving. Plus, it’s reversible, you can go back and forth how many times you want;
- HDR and wide-gamut support.

Why would you avoid JPEGXL then? The web. Again, this was a non-issue for me, I have my pictures loaded on [Immich](https://immich.app/) and everything works as expected. But, JPEGXL has a long history of resistance from both Google and Mozilla. As of 2026 [support for JPEGXL is coming](https://www.firefox.com/en-US/firefox/149.0a1/releasenotes/) to both browsers but I would not bet on it just now. On top of this, JPEGXL needs custom encoders and decoders which may be an issue for large scale media serving applications. This problem has been tackled at google with [jpegli](https://github.com/google/jpegli) which is a JPEG encoder/decoder adopting some of the techniques used in JPEGXL while keeping full compatibility with jpeg files (it produces straight jpeg files).

As I was saying, for me the best JPEGXL use case is photography. I have developed a [script](https://codeberg.org/dpaletti/gx85-raw-development) which employs [darktable] (<https://www.darktable.org/>) to develop my RAW files through a custom preset and export them as JPEGXL. The script is pretty straightforward, and also the preset is built to resemble the rendering you would get straight out of my camera (a lumix GX85). The only complicated bit is metadata, darktable strips files of their original metadata. For this we need [exiftool](https://exiftool.org/) which lets us copy metadata from one picture to the other. Some of the merit must go to the more modern pipeline inside darktable than the one we find in a 2015 digital camera.

## OPUS: the best tradeoff between FLAC and MP3

[OPUS](https://github.com/xiph/opus) is free, open source and standaridized through [RFC 6716](https://datatracker.ietf.org/doc/html/rfc6716). Opus is the most used codec on the planet: Discord, Whatsapp, Youtube and many other companies use it for their own media. Opus can handle a wide range of audio applications, including Voice over IP, videoconferencing, in-game chat, and even remote live music performances. It can scale from low bitrate narrowband speech to high quality stereo music.

My use case is straightforward, archiving music on [navidrome](https://www.navidrome.org/). Again, I do not mind slightly longer encoding/deconding times or application support. I just want a high-fidelity output in the smallest possible package.

Why I chose OPUS:

- 192 kbps bitrate files are indistinguishable (to my hear) from a FLAC file;
- OPUS output is far smaller (like 10 times) than FLAC;
- encoding time is decent;

One of the magic tricks behind OPUS is variable bitrate (VBR), increasing the bitrate in complex audio passages to get high-fidelity while removing redundancy.

I have implemented a [script](https://codeberg.org/dpaletti/flac-to-opus) to convert a folder of FLAC files to Opus. Again, the issue here is with metadata. I decided to use [opusenc](https://www.opus-codec.org/docs/opus-tools/opusenc.html) for the encoding part to get the latest encoding technology. I was not seeing album covers anymore (yet, still seing song covers). [ffmpeg](https://www.ffmpeg.org/) came to the rescue, I was able to extract the cover from one of the songs and use that as album cover. This expects that your folder represents an album, this was my case so it’s good enough.

## Conclusion

This was a rewarding trip in the “latest” encoding technology. These codecs make archiving easier and cheaper while retaining high quality files. Both these technologies are established and widely adopted yet I did not know them, maybe someone else gets to use them after reading this article.
