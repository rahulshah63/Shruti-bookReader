from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/file")
async def create_upload_file(file: UploadFile = File(...)):
    print('request incoming with file :', file)
    return {"filename": file.filename}