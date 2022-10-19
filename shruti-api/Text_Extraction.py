#https://github.com/globalpolicy/PreetiToUnicode
#added special characters that are caused by “, ”, ;

import PyPDF2
import base64
from io import BytesIO

class PDFExtract :
    #*********************** Conversion from Preeti to Unicode ***********************#
    unicodeatoz=["ब","द","अ","म","भ","ा","न","ज","ष्","व","प","ि","फ","ल","य","उ","त्र","च","क","त","ग","ख","ध","ह","थ","श"]
    unicodeAtoZ=["ब्","ध","ऋ","म्","भ्","ँ","न्","ज्","क्ष्","व्","प्","ी","ः","ल्","इ","ए","त्त","च्","क्","त्","ग्","ख्","ध्","ह्","थ्","श्"]
    unicode0to9=["ण्","ज्ञ","द्द","घ","द्ध","छ","ट","ठ","ड","ढ"]
    symbolsDict=\
    {
        "~":"ञ्",
        "`":"ञ",
        "!":"१",
        "@":"२",
        "#":"३",
        "$":"४",
        "%":"५",
        "^":"६",
        "&":"७",
        "*":"८",
        "(":"९",
        ")":"०",
        "-":"(",
        "_":")",
        "+":"ं",
        "[":"ृ",
        "{":"र्",
        "]":"े",
        "}":"ै",
        "\\":"्",
        "|":"्र",
        ";":"स",
        ":":"स्",
        "'":"ु",
        "\"":"ू",
        ",":",",
        "<":"?",
        ".":"।",
        ">":"श्र",
        "/":"र",
        "?":"रु",
        "=":".",
        "ˆ":"फ्",
        "Î":"ङ्ख",
        "Í":"ङ्क",
        "å":"द्व",
        "÷":"/"
    }

    #arranging certain characters, symbols for proper output
    def normalizePreeti(preetitxt):
        normalized=''
        previoussymbol=''
        preetitxt=preetitxt.replace('qm','s|')
        preetitxt=preetitxt.replace('f]','ो')
        preetitxt=preetitxt.replace('km','फ')
        preetitxt=preetitxt.replace('0f','ण')
        preetitxt=preetitxt.replace('If','क्ष')
        preetitxt=preetitxt.replace('if','ष')
        preetitxt=preetitxt.replace('cf','आ')
        #my changes
        preetitxt=preetitxt.replace('O{', '')
        preetitxt=preetitxt.replace('Í', '')
        preetitxt=preetitxt.replace('æ', '') #opening quotation
        preetitxt=preetitxt.replace('Æ', '') #closing quotation
        preetitxt=preetitxt.replace('Ù', '') #;
        preetitxt=preetitxt.replace('«', '|')
        preetitxt=preetitxt.replace('¿', '?') #dirga ru

        index=-1
        while index+1 < len(preetitxt):
            index+=1
            character=preetitxt[index]
            try:
                #for rearranging र् 
                if preetitxt[index+2] == '{':
                    temp=preetitxt[index+1]
                    if temp=='f' or temp=='ो' or temp=='}' or temp=='L':
                        normalized+='{'+character+temp
                        index+=2
                        continue
                if preetitxt[index+1] == '{':
                    if character!='f':
                        normalized+='{'+character
                        index+=1
                        continue
            except IndexError:
                pass
            if character=='l':
                previoussymbol='l'
                continue
            else:
                normalized+=character+previoussymbol
                previoussymbol=''
        return normalized

    def convert(preeti):
        converted=''
        normalizedpreeti=PDFExtract.normalizePreeti(preeti)
        for index, character in enumerate(normalizedpreeti):
            try:
                if ord(character) >= 97 and ord(character) <= 122:
                    converted+=PDFExtract.unicodeatoz[ord(character)-97]

                elif ord(character) >= 65 and ord(character) <= 90:
                    converted+=PDFExtract.unicodeAtoZ[ord(character)-65]

                elif ord(character) >= 48 and ord(character) <= 57:
                    converted+=PDFExtract.unicode0to9[ord(character)-48]

                else:
                    converted+=PDFExtract.symbolsDict[character]

            except KeyError:
                converted+=character
                
        return converted


    #*********************** Extraction of content from PDF ***********************#
    pdfReader = None
    pageNumber = -1

    #Decodes the string to byte format. Returns BytesIO
    def encodedBase64ToObj(encoded_string):
        ioBytes = PDFExtract.decode64(encoded_string)
        PDFExtract.pdfReader = PyPDF2.PdfFileReader(ioBytes)
        PDFExtract.pageNumber = PDFExtract.pdfReader.numPages
    
    def decode64(encoded_string):
        return BytesIO(base64.b64decode(encoded_string))

    def pdfToObj(self, src):
        pdfFileObj = open(src, 'rb')
        print(pdfFileObj)
        PDFExtract.pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
        PDFExtract.pageNumber = PDFExtract.pdfReader.numPages 

    @staticmethod
    def getPageNumber():
        return PDFExtract.pageNumber

    def stringProcessing(sentStr):
        sentStr = sentStr.replace('\u200c', '')
        return sentStr

    def wordList(pageNumber):
        if PDFExtract.pdfReader == None or PDFExtract.pageNumber < 1:
            print("No any PDF source")
            exit(-2)

        if pageNumber<0 or pageNumber>PDFExtract.pageNumber:
            print("Page Number Invalid")
            exit(-1)

        #extracts content of the page   
        pageObj = PDFExtract.pdfReader.getPage(pageNumber) 
        extractedText = pageObj.extractText()

        #checks for ascii of प, ा, र  if in Preeti. Requires conversion if true
        if 'k' in extractedText or 'f' in extractedText  or '/' in extractedText:
            extractedText = PDFExtract.convert(extractedText)
        
        extractedText = PDFExtract.stringProcessing(extractedText)
        
        #separation by word using intermediate space
        wordList = (extractedText).split()
        return(wordList)
    
    def sentenceList(self, pageNumber):
        wordList = PDFExtract.wordList(pageNumber)
        sentence = ''
        sentenceList = []

        #separation by sentence using ।, !, ?
        for i in wordList:
            if i == '।':
                sentenceList.append(sentence + '।')
                sentence = ''
            elif i == '!':
                sentenceList.append(sentence + '!')
                sentence = ''
            elif i == '?':
                sentenceList.append(sentence + '?')
                sentence = ''
            else:
                sentence += i + ' '

        if len(sentence) > 0:
            sentenceList.append(sentence)

        return sentenceList


# if __name__ == "__main__":
#     e1 = PDFExtract()
#     e1.pdfToObj('MunamadanTxt.pdf')
#     page = e1.getPageNumber()
#     for i in range (page):
#         print(e1.sentenceList(i))
#         print('\n\n\n',  i)