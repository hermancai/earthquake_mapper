class PageBuilder {
    constructor() {
        var map = document.getElementById("map");
    }

    loadPage() {
        document.getElementById("clickhere").addEventListener("click", function() {
            console.log("clicked here")
        })
    }
}

var pb = new PageBuilder();
pb.loadPage();