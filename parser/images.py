import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

def get_pose_box(img: np.ndarray):
    h, w = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = pose.process(rgb)
    if not res.pose_landmarks:
        return None

    # collect all landmark x,y in pixels
    pts = [(int(lm.x * w), int(lm.y * h)) for lm in res.pose_landmarks.landmark]
    xs, ys = zip(*pts)
    x1, x2 = max(0, min(xs)), min(w, max(xs))
    y1, y2 = max(0, min(ys)), min(h, max(ys))
    return x1, y1, x2-x1, y2-y1

def crop_centered(img, cx, cy, crop_w, crop_h):
    h, w = img.shape[:2]
    x1 = max(0, min(int(cx - crop_w//2), w - crop_w))
    y1 = max(0, min(int(cy - crop_h//2), h - crop_h))
    return img[y1:y1+crop_h, x1:x1+crop_w]

img = cv2.imread('./ab_wheel_rollout.jpg')
box = get_pose_box(img)
if box:
    x, y, bw, bh = box
    cx, cy = x + bw/2, y + bh/2
else:
    cx, cy = img.shape[1]//4, img.shape[0]//2  # fallback

crop = crop_centered(img, cx, cy, img.shape[1]//2, img.shape[0])
cv2.imwrite('./ab_wheel_rollout_new.jpg', crop)