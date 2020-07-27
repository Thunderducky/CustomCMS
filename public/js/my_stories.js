var $target = $("#target")
function renderStories(stories){
    if(stories.length > 0){
    return `
    <ul>
        ${stories.map(story => {
            return `
            <li>
                <h2>${story.title} - ${story.published ? "published" : "unpublished" }</h2>
                <h3>${story.body.substr(0, 40)}...</h2>
                <a href="/story/edit?id=${story.id}">Edit this story</a>
            </li>
            `
        }).join("")}
    </ul>
    `} else {
        return `<p>You haven't created any stories yet</p>`
    }
}

$.get("/api/story/mine").then(stories => {
    $target.html(
        `
            ${renderStories(stories)}
        `
    )
})