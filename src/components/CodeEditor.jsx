import { Box, Button, HStack,  Textarea } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from '../constants';
import Output from '../components/Output';

export default function CodeEditor(props) {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [input, setInput] = useState("");
  
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <Box>
      <HStack spacing={3}>
        <Box w={"50%"}>
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height="60vh"
            theme={props.themeEditor}
            language={language}
            defaultValue='console.log("Hello, Wrold!");'
            value={value}
            onChange={(value) => setValue(value)}
            onMount={onMount}
          />
          <Textarea
            placeholder="Enter input here if needed..."
            mt={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} input={input} />
      </HStack>
    </Box>
  );
}
