from fastapi import FastAPI, UploadFile, File
import aiofiles
from Text_Extraction import PDFExtract

app = FastAPI()

@app.post("/uploadpdf")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    print(str(contents)[2:-1])
    async with aiofiles.open(file.filename, mode='wb') as f:
        await f.write(contents)
        e1 = PDFExtract()
        e1.pdfToObj(file.filename)
        page = e1.getPageNumber()
        for i in range (page):
            print(e1.sentenceList(i))
            print('\n\n\n',  i)
    return {"filename": file.filename}