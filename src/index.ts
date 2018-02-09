import PostWoman from './PostWoman/PostWoman';

const HelloWorld = () => {
  new PostWoman();
  const msg = 'Bundling works!';
  console.log(msg);
  return msg;
};

export default HelloWorld();
