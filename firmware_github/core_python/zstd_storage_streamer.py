"""
Zstandard & MessagePack Direct-RAM Storage Streamer
Handles high-density compression and instantaneous in-memory decompression.
"""
import zstandard as zstd
import msgpack
import time
import json
import os

class ZstdStorageStreamer:
    def __init__(self):
        self.cctx = zstd.ZstdCompressor(level=15)
        self.dctx = zstd.ZstdDecompressor()

    def compress_jsonl(self, records: list, output_path: str):
        """Compress list of records to .jsonl.zst binary archive."""
        raw_text = "\n".join([json.dumps(r) for r in records]).encode("utf-8")
        compressed = self.cctx.compress(raw_text)
        with open(output_path, "wb") as f:
            f.write(compressed)
        
        ratio = (1.0 - (len(compressed) / max(len(raw_text), 1))) * 100
        return {
            "raw_size": len(raw_text),
            "compressed_size": len(compressed),
            "ratio_pct": round(ratio, 2)
        }

    def decompress_to_ram(self, file_path: str):
        """Decompress .zst directly into RAM memory buffer without writing intermediate disk files."""
        t0 = time.perf_counter()
        if not os.path.exists(file_path):
            return {"error": "File not found"}

        with open(file_path, "rb") as f:
            compressed_data = f.read()

        decompressed = self.dctx.decompress(compressed_data)
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        
        return {
            "decompressed_bytes": len(decompressed),
            "elapsed_ms": round(elapsed_ms, 2),
            "throughput_mbs": round((len(decompressed) / (1024 * 1024)) / max(elapsed_ms / 1000.0, 0.001), 2)
        }
