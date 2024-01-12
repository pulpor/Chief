import YouTube from "react-youtube";

export function RecipeVideo({ strYoutube }: { strYoutube: string }) {
  if (!strYoutube) {
    return null;
  }

  const videoId = strYoutube.split('v=')[1];
  const options = { 
    height: '250px',
    width: '100%'
  };

  return (
    <div className="youtubeContainer" data-testid="video">
      <YouTube className="youtube" videoId={videoId} opts={options} /> 
    </div>
  );
}
