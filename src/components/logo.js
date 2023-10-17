import React from 'react';

function generateLogo(firstName) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '50px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(firstName[0], canvas.width / 2, canvas.height / 2);;
    const dataURI = canvas.toDataURL();
    return <img src={dataURI} alt={firstName + ' logo'} />;
  }
 


const Logo = ({ firstName }) => {
  const logo = generateLogo(firstName);

  return (
    <div>
      {logo}
    </div>
  );
};

export default Logo;
