import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import window from '../constants/Layout';
import pdfs from '../constants/loadedPdfs';
import { MonoText } from '../components/StyledText';
import React, { useState }  from "react";
import {Card, Button , Title ,Paragraph, Snackbar, FAB, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import * as DocumentPicker from "expo-document-picker";

// interface pdf {
//     mimeType: string;
//     name: string;
//     size: number;
//     type: string;
//     uri: string;
// }


const Home = ({ navigation }) => {
    const [_pdfs, setPdfs] = useState([]);
    const [pdfSource, setPdfSource] = useState(null);
    const [openPdf, setOpenPdf] = useState<boolean>(false);
    const [SnackVisible, setSnackVisible] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    const [ModalVisible, setModalVisible] = React.useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);
    const containerStyle = {backgroundColor: '#e5e5e5', height: '60%', width: '70%', 
    borderRadius: 20, alignSelf: 'center', padding: 20,};

    const onToggleSnackBar = () => setSnackVisible(!SnackVisible);
    const onDismissSnackBar = () => setSnackVisible(false);

    const addDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({type: "application/pdf", copyToCacheDirectory: true}); 
        if(result.type === "success"){
            var doesExist = false;
            _pdfs.map((pdf) => {
                if(pdf.name === result.name && pdf.size === result.size){
                    setErrMsg('File already exists');
                    onToggleSnackBar();
                    doesExist = true;
                }
            })
            
            if(!doesExist){
                setPdfs([..._pdfs, result]);
            }
        }
        else{
            setErrMsg('Error while picking file');
            onToggleSnackBar();
            
        }
    };

    return(
        <Provider>
            <View style={Styles.container}>
                <TouchableOpacity>
                    <Card style={Styles.addCardContainer}
                    mode="outlined"
                    onPress={addDocument}
                    // onLongPress={}
                    >
                        <Card.Content style={{paddingTop: 80}}>
                                <FontAwesome
                                    name="file-pdf-o"
                                    size={25}
                                    style={{ marginLeft: 30 }}
                                />
                                <Title>
                                    <MonoText style={{fontSize: 18}}>Import Pdf</MonoText>
                                </Title>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>

                {_pdfs.map((pdf, index) => {
                    return (
                        <TouchableOpacity key={index}>
                            <Card style={Styles.cardContainer}
                            onPress={() => {
                                // setPdfSource(pdf);
                                // setOpenPdf(true);
                                navigation.navigate('Pdf', {pdf: pdf})
                            }}
                            mode='contained'
                            // onLongPress={}  //TODO: Delete Pdf
                            >
                            {/* <Card.Cover style={Styles.coverImg} source={require(pdf.cover)} /> */}
                                <Card.Content>
                                    <Title>
                                        <MonoText style={{fontSize: 16}}>{pdf.name}</MonoText>
                                    </Title>
                                    <Paragraph>
                                        <MonoText style={{fontSize: 14}}>Size: {pdf.size/1024}kB</MonoText>
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    );
                })}

                <Portal>
                <Modal visible={ModalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <MonoText style={{textAlign: 'center'}}>Add a new PDF using link</MonoText>
                    <TextInput
                    mode="outlined"
                    label="PDF Link"
                    right={<TextInput.Affix text="🔗" />}
                    // multiline={true}
                    // numberOfLines={2}
                    style={{width: '100%', alignSelf: 'center', margin: 15}}
                    />
                    <Button mode="contained" color="#ffb6c1" onPress={() => console.log('Pressed')}
                    labelStyle={{ color: "#000000" }}
                    style={{width: '50%', alignSelf: 'center', marginTop: 50}}>
                    <MonoText>Fetch Pdf</MonoText>
                    </Button>
                </Modal>
                </Portal>
                <FAB style={Styles.fab} icon="file-find-outline" onPress={showModal} />

                <Snackbar
                visible={SnackVisible}
                onDismiss={onDismissSnackBar}
                >
                    {errMsg}
                </Snackbar>
            </View>
        </Provider>
    )
}
export default Home;
  
const Styles = StyleSheet.create({
    container: {
        display: 'flex',    
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer :{
        // flex: 1,
        alignContent:'space-between',
        textAlign: 'center',
        margin: 10,
        width: (window.window.width - 60)/2,
        height:220,
        backgroundColor: '#ffb6c180',
    },
    addCardContainer :{
        // flex: 1,
        alignContent:'space-between',
        textAlign: 'center',
        margin:10,
        width:130,
        height:220,
        backgroundColor: '#F0F8FF',
    },
    coverImg: {
        width: '100%',
        height: '60%',
        resizeMode: 'stretch',
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        backgroundColor: '#ffb6c1',
    },
})