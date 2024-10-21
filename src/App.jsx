import { Box } from '@chakra-ui/react';
import CodeEditor from './components/CodeEditor';
import Navbar from './components/Navbar';
import { useState } from 'react';

function App() {
  const [bgColor,setbgColor]=useState("#0f0a19");
  const [theme,SetTheme] = useState("vs-dark");
  const toggeleMode =()=>{
    if(bgColor == "#0f0a19" ){
      setbgColor("#fffff4");
      SetTheme("");
    }
    else{
      setbgColor("#0f0a19");
      SetTheme("vs-dark")
    }
  }
  return (
    <>
    <Navbar color='gray.500' toggeleMode={toggeleMode} />
    <Box
    minH="100vh" bg={bgColor} color='gray.500' px={6} py={8}
    >
    <CodeEditor themeEditor={theme}/>
    </Box>
    </>
  );
}

export default App;
