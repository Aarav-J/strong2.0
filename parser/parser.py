import os 
import requests 
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import csv 

url = 'https://training.fit/exercise/dumbbell-bench-press/'; 
base_url = "https://training.fit/exercise/"

def get_all_exercise(base_url: str) -> list: 
    resp = requests.get(base_url)
    resp.raise_for_status() 
    soup = BeautifulSoup(resp.text, 'html.parser')
    exercises = soup.find_all("a", attrs={"rel": "bookmark"})
    exercise_data = []
    for exercise in exercises: 
        exercise_data.append(exercise.get('href'))

    return exercise_data

def download_images_from_page(soup: BeautifulSoup, page_url: str, folder: str, file_name: str) -> None:
    os.makedirs(folder, exist_ok=True)
    resp = requests.get(page_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    img = soup.find('img', class_="nv-featured-image")

    src = img.get('src')
    if not src:
        return
    img_url = urljoin(page_url, src)
    # parsed = urlparse(img_url)
    # filename = os.path.basename(parsed.path)
    # if not filename: 
    #     filename = f"image_{hash(img_url)}.jpg"
    file_path = os.path.join(folder, f"{file_name}.jpg")

    try:
        with requests.get(img_url, stream=True) as r: 
            r.raise_for_status() 
            with open(file_path, 'wb') as f: 
                for chunk in r.iter_content(chunk_size=8192): 
                    if chunk: 
                        f.write(chunk)
        print(f"Saved {img_url} to {file_path}")
    except Exception as e: 
        print(f"Failed to download {img_url}: {e}")

def get_page_information(soup: BeautifulSoup) -> dict:
    info = {}
    info['level'] = soup.find('p', class_="tm-level").text.strip()
    info['name'] = soup.find('h1', attrs={"itemprop": "headline"}).text.strip()
    info['equipment'] = [content.text.strip() for content in soup.find("ul", class_="tm-list-equipment").contents]
    info['target'] = soup.find("p", class_="tm-widget-uebung-title").text.strip().split(" ")[0]
    directions = soup.find_all("p", class_='num')
    directionArr = []
    for direction in directions: 
        directionArr.append(direction.text.strip())
    info['directions'] = directionArr
    info['type'] = soup.find_all("header")[1].find("span").text.split(", ")[0].strip()
    info['image_path'] = f"{info['name'].replace(' ', '_').lower()}.jpg"
    return info


def write_to_csv(index, data: dict, file_path: str) -> None:
    fieldnames = ['id', 'name', 'level', 'target', 'equipment', 'directions', 'type', "image_path"]   
    with open(file_path, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        data['id'] = index
        writer.writerow(data)
if __name__ == "__main__":
    exercise_links = get_all_exercise(base_url)
    # with open('./exercises.csv', 'w', newline='', encoding='utf-8') as file:
    #     fieldnames = ['name', 'level', 'target', 'equipment', 'directions', 'type', "image_path"]
    #     writer = csv.DictWriter(file, fieldnames=fieldnames)
    #     writer.writeheader() 
    for index, link in enumerate(exercise_links): 
        resp = requests.get(link)
        resp.raise_for_status() 
        soup = BeautifulSoup(resp.text, 'html.parser')
        page_info = get_page_information(soup)
        write_to_csv(index, page_info, './exercises.csv')
        # download_images_from_page(soup, link, './downloaded_images', page_info['image_path'])
    # resp = requests.get(url)
    # resp.raise_for_status() 
    # soup = BeautifulSoup(resp.text, 'html.parser')
    # page_info = get_page_information(soup)
    # print(page_info)
    # write_to_csv(page_info, './exercises.csv')
    # get_all_exercise(base_url)
    # with open('./exercises.csv', mode='r', newline='', encoding='utf-8') as infile, \
    #  open('./exercises.csv', mode='w', newline='', encoding='utf-8') as outfile:
    #     reader = csv.DictReader(infile)
    #     fieldnames = ['id', 'name', 'level', 'target', 'equipment', 'directions', 'type', "image_path"]  
    #     i = 0
    #     newDict = []
    #     for row in reader: 
    #         row['id'] = i
    #         # writer.writerow(row)
    #         newDict.append(row)
    #         i += 1
    #     writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    #     writer.writeheader()
    #     writer.writerows(newDict)


   
    # download_images_from_page(soup, url, './downloaded_images', "dumbbell_bench_press")
    # print("Download completed.")


