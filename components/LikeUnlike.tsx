import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
interface LikeUnlikeProps {
  hasLiked: Boolean;
  isLoading: boolean;
  clickHandler: () => null | void;
}

export const LikeUnlike: React.FC<LikeUnlikeProps> = ({
  hasLiked,
  isLoading = false,
  clickHandler,
}) => {
  return (
    <Button
      onClick={clickHandler}
      isLoading={isLoading}
      p={2}
      style={{ cursor: `${isLoading ? 'not-allowed' : 'pointer'}` }}
    >
      <Icon
        viewBox='0 0 512 512'
        boxSize={10}
        color={hasLiked ? 'red.500' : 'white'}
        isLoading={true}
      >
        <path
          fill='currentColor'
          d='M365.4,59.628c60.56,0,109.6,49.03,109.6,109.47c0,109.47-109.6,171.8-219.06,281.271    C146.47,340.898,37,278.568,37,169.099c0-60.44,49.04-109.47,109.47-109.47c54.73,0,82.1,27.37,109.47,82.1    C283.3,86.999,310.67,59.628,365.4,59.628z'
        />
      </Icon>
    </Button>
  );
};
