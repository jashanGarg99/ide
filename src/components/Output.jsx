import { Box, Button, Text, useToast, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { executeCode } from '../api'; // Assuming this exists for code execution
import axios from 'axios'; // To handle HTTP requests

const Output = ({ language, editorRef, input }) => {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [uniqueId, setUniqueId] = useState(''); // Store the unique ID after saving code
  const [codeIdInput, setCodeIdInput] = useState(''); // For input to fetch code by ID
  const [hasExecuted, setHasExecuted] = useState(false); // Track if the code has been executed
  const toast = useToast();

  // Run Code function
  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    setIsLoading(true);
    setIsError(false);
    setHasExecuted(false); // Reset execution status
    try {
      const { run: result } = await executeCode(language, sourceCode, input);
      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr);
      } else {
        setOutput(result.output);
      }
      setHasExecuted(true); // Mark as executed
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Store Code in the database and get a unique ID
  const saveCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      const response = await axios.post('http://localhost:5000/storeCode', {
        code: sourceCode,
        language,
        input
      });

      if (response.data.success) {
        setUniqueId(response.data.uniqueId);
        toast({
          title: "Code Saved",
          description: `Your code ID is ${response.data.uniqueId}`,
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Unable to save code",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Unable to save code",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Retrieve Code using unique ID
  const fetchCode = async () => {
    if (!codeIdInput) return;

    try {
      const response = await axios.get(`http://localhost:5000/getCode/${codeIdInput}`);
      if (response.data.success) {
        const { code } = response.data.code;
        editorRef.current.setValue(code); // Set the editor content with the retrieved code
        toast({
          title: "Code Loaded",
          description: "Code has been successfully loaded",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Code not found",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Unable to fetch code",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Clear the output
  const clear = () => {
    setOutput('');
    setHasExecuted(false); // Reset execution status
  };

  return (
    <Box w="50%">
      <Text mb="2" fontSize="lg">Output</Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Button
        variant="outline"
        colorScheme="red"
        onClick={clear}
        mb={4}
        ml={4}
      >
        Clear
      </Button>

      {/* Button to Save Code */}
      <Button
        variant="outline"
        colorScheme="blue"
        mb={4}
        ml={4}
        onClick={saveCode}
      >
        Save Code
      </Button>

      {/* Display the unique ID after saving */}
      {uniqueId && (
        <Text mt={2} color="blue.600">Your Code ID: {uniqueId}</Text>
      )}

      {/* Input to fetch code by ID */}
      <Input
        placeholder="Enter Code ID"
        value={codeIdInput}
        onChange={(e) => setCodeIdInput(e.target.value)}
        mb={4}
        width="60%"
      />
      <Button
        variant="outline"
        colorScheme="blue"
        mb={4}
        onClick={fetchCode}
      >
        Load Code by ID
      </Button>

      {/* Output display with status messages */}
      <Box
        height="75vh"
        p={2}
        color={isError ? 'red.400' : ''}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? 'red.500' : '#333'}
        whiteSpace="pre-wrap"
        overflowY="auto"
      >
        {output || 'Click "Run Code" to see the output here'}
        {hasExecuted && (
          <Text mt={2} fontWeight="bold" color={isError ? 'red.400' : 'green.400'}>
            {isError ? 'CODE EXECUTED WITH ERRORS' : 'CODE EXECUTED SUCCESSFULLY'}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Output;
