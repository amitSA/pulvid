$.ajax({
    type: "POST",
    url: "http://localhost:3000/webcast/redir",
    data: { d1: Opencast.Watch.getDescriptionEpisodeURL(), d2: "hijoOO" },
    success: null,
    dataType: "text"
});