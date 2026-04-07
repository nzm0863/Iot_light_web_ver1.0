# ESP32 IoT LED Controller

👉 WebブラウザからLEDの色や光り方を操作できるIoTシステム

🎥 デモ動画
https://youtube.com/shorts/1yj3Q7_K6Y8

---

## 概要
ESP32を使用し、同一WiFi内のブラウザからLED制御を行うシステム。
mDNSを利用してIPアドレスが変わってもアクセス可能。

---

## 機能
- LED ON/OFF
- 色変更（NeoPixel）
- ブラウザからリアルタイム操作

---

## 技術構成
- ESP32（Arduino IDE）
- NeoPixel LED
- HTML / CSS / JavaScript
- mDNS（esp32.local）

---

## システム構成
![API]API.png

---

## ポイント
- ローカルネットワーク内で簡単に操作可能
- IP固定不要で運用できる構成