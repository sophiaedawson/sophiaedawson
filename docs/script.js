const video = document.getElementById("heroVideo");
if(video){
  video.play().catch(() => {
    document.addEventListener("touchstart", () => {
      video.play();
    }, { once:true });
  });
}
