import os
import subprocess
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import telebot

# ===================== CONFIG =====================
BOT_TOKEN = os.environ.get("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
bot = telebot.TeleBot(BOT_TOKEN)

# ===================== VIDEO SLICER LOGIC =====================
def slice_video(input_path):
    """১৫ সেকেন্ডের ভিডিওকে রি-এনকোড ছাড়া ৩ সেকেন্ডের ৫টি ক্লিপে কাটবে"""
    generated_clips = []
    
    for i in range(5):
        start_time = i * 3
        output_path = f"clip_{i+1}.mp4"
        
        # '-c copy' ব্যবহারের কারণে র‍্যাম ক্র্যাশ করবে না, ১ সেকেন্ডে কাটবে
        cmd = f"ffmpeg -i {input_path} -ss {start_time} -t 3 -c copy -y {output_path}"
        
        result = subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if result.returncode == 0 and os.path.exists(output_path):
            generated_clips.append(output_path)
            
    return generated_clips

# ===================== TELEGRAM HANDLERS =====================
@bot.message_handler(commands=['start'])
def start(message):
    bot.reply_to(message, "👋 আমাকে একটি ১৫ সেকেন্ডের ভিডিও পাঠাও। আমি সেটিকে ৩ সেকেন্ডের ৫টি আলাদা ক্লিপে কেটে দেব।")

@bot.message_handler(content_types=['video', 'document'])
def handle_video(message):
    # ফাইল আইডি নেওয়া (ভিডিও বা ডকুমেন্ট হিসেবে পাঠালে)
    if message.content_type == 'video':
        file_id = message.video.file_id
    else:
        if message.document.mime_type and 'video' in message.document.mime_type:
            file_id = message.document.file_id
        else:
            return

    msg = bot.reply_to(message, "⏳ ভিডিওটি ডাউনলোড করা হচ্ছে...")
    input_file = "input_video.mp4"
    
    try:
        # টেলিগ্রাম সার্ভার থেকে ভিডিও ডাউনলোড
        file_info = bot.get_file(file_id)
        downloaded_file = bot.download_file(file_info.file_path)
        
        with open(input_file, 'wb') as f:
            f.write(downloaded_file)
            
        bot.edit_message_text("✂️ ভিডিও স্লাইস করা হচ্ছে...", message.chat.id, msg.message_id)
        
        # ভিডিও কাটার ফাংশন কল
        clips = slice_video(input_file)
        
        if clips:
            bot.edit_message_text("📤 ক্লিপগুলো টেলিগ্রামে আপলোড করা হচ্ছে...", message.chat.id, msg.message_id)
            
            # প্রতিটি ক্লিপ একে একে সেন্ড করা
            for clip in clips:
                with open(clip, 'rb') as video_clip:
                    bot.send_video(message.chat.id, video_clip, reply_to_message_id=message.message_id)
                os.remove(clip) # সেন্ড করার পর ফাইল ডিলিট (সার্ভার স্পেস বাঁচাতে)
                
            bot.delete_message(message.chat.id, msg.message_id)
        else:
            bot.edit_message_text("❌ ভিডিওটি প্রসেস করা যায়নি।", message.chat.id, msg.message_id)
            
    except Exception as e:
        print(f"Error: {e}")
        bot.edit_message_text("❌ কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করো।", message.chat.id, msg.message_id)
        
    finally:
        # মূল ইনপুট ফাইল ডিলিট
        if os.path.exists(input_file):
            os.remove(input_file)

# ===================== KEEP ALIVE SERVER =====================
class DummyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Slicer Bot is Alive!")

def keep_alive():
    port = int(os.environ.get("PORT", 8080))
    HTTPServer(('0.0.0.0', port), DummyServer).serve_forever()

threading.Thread(target=keep_alive, daemon=True).start()

if __name__ == "__main__":
    print("[+] Video Slicer Bot Started...")
    bot.infinity_polling()
