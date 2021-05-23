import React from 'react'
// import RedLike from '../public/like_red.svg';

// using `path`
// const LikeRedIcon = createIcon({
//   displayName: "UpDownIcon",
//   viewBox: "0 0 200 200",
//   // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
//   path: (
//     <path
//       fill="currentColor"
//       d="M365.4,59.628c60.56,0,109.6,49.03,109.6,109.47c0,109.47-109.6,171.8-219.06,281.271    C146.47,340.898,37,278.568,37,169.099c0-60.44,49.04-109.47,109.47-109.47c54.73,0,82.1,27.37,109.47,82.1    C283.3,86.999,310.67,59.628,365.4,59.628z"
//     />
//   ),
// })

// OR using the `d` value of a path (the path definition) directly
// export const UpDownIcon = createIcon({
//   displayName: "UpDownIcon",
//   viewBox: "0 0 200 200",
//   d: "M365.4,59.628c60.56,0,109.6,49.03,109.6,109.47c0,109.47-109.6,171.8-219.06,281.271    C146.47,340.898,37,278.568,37,169.099c0-60.44,49.04-109.47,109.47-109.47c54.73,0,82.1,27.37,109.47,82.1    C283.3,86.999,310.67,59.628,365.4,59.628z",

interface LikeUnlikeProps {
  hasLiked: Boolean;
  clickHandler: () => null | void;
}

export const LikeUnlike: React.FC<LikeUnlikeProps> = ({ hasLiked, clickHandler }) => {
    return (
      <div style={{width: '55px', cursor: 'pointer'}} onClick={clickHandler}>
        {hasLiked ? <img src='/like_red.svg' alt='red_like' /> : <img src='/like_white.svg' alt='red_white' />}
      </div>
    );
}