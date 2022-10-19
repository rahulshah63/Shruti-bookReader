import PyPDF2
import base64
from io import BytesIO

#Decodes the string to byte format. Returns BytesIO
def decode64(encoded_string):
    return BytesIO(base64.b64decode(encoded_string))

def bytesToList(ioBytes, pageNumber):
    # creating a pdf reader object 
    pdfReader = PyPDF2.PdfFileReader(ioBytes) 

    if pageNumber < 0 or pageNumber > pdfReader.numPages:
        print("Page Number Invalid")
        return
        
    pageObj = pdfReader.getPage(pageNumber)

    wordList = (pageObj.extractText()).split()
    return(wordList)

def pdfToList(ioBytes, pageNumber):

    pageNumber = 0

    pdfFileObj = open('Munamadan1Page.pdf', 'rb') 
    
    # creating a pdf reader object 
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj) 

    if pageNumber < 0 or pageNumber > pdfReader.numPages:
        print("Page Number Invalid")
        return
        
    pageObj = pdfReader.getPage(pageNumber) 
    print(pageObj.extractText())

    wordList = (pageObj.extractText()).split()
    #return(wordList)


#text file contains base64 encoded string
input_file = open('NepaliPdf.txt', 'rb')
encoded_string = input_file.read()
input_file.close()


ioBytes = decode64(encoded_string)
#print(bytesToList(ioBytes, 0))
print(pdfToList(ioBytes, 0))