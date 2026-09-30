import qrcode

product_code = "SRK-001"
url = f"http://localhost:3000/verify?code={product_code}"

img = qrcode.make(url)
img.save("srk_qr_code.png")
print("QR code saved as srk_qr_code.png")
