import { Alert, AlertIcon, Stack } from '@chakra-ui/react';
import { ChakraInterface } from '../../Functions/interfaces';

const ChakraMessage = ({message}:ChakraInterface) => {
  return (<>
    <Stack> 
      <Alert status='info' variant='left-accent'>
        <AlertIcon width={20} className="ml-7 mt-1" /><span className='ml-2'>{message}</span></Alert>
    </Stack>
  </>
  );
};

export default ChakraMessage;
