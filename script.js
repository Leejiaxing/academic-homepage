(function () {
  function toTitleCase(value) {
    return (value || "").toLowerCase().replace(/\b\w/g, function (m) {
      return m.toUpperCase();
    });
  }

  function linkClassByLabel(label) {
    var key = (label || "").trim().toLowerCase();
    if (key === "paper") {
      return "paper-tag paper-tag-paper";
    }
    if (key === "data") {
      return "paper-tag paper-tag-data";
    }
    if (key === "website") {
      return "paper-tag paper-tag-website";
    }
    if (key === "code") {
      return "paper-tag paper-tag-code";
    }
    return "paper-tag";
  }

  function createLink(href, text) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value || "";
    }
  }

  fetch("site-data.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load site-data.json");
      }
      return response.json();
    })
    .then(function (data) {
      var profile = data.profile || {};
      var photoSrc = profile.photo_src || (profile.photo && profile.photo.src) || "assets/profile-photo.svg";
      var photoAlt = profile.photo_alt || (profile.photo && profile.photo.alt) || "Profile photo";

      document.title = (profile.name || "Academic Homepage") + " | " + (profile.role || "");
      setText("name", profile.name || "Academic Homepage");
      setText("role", profile.role || "");
      setText("intro", (data.hero && data.hero.description) || profile.intro || "");
      setText("about-text", profile.about || "");
      setText("footer-text", data.footer || "© 2026 " + (profile.name || ""));

      var img = document.getElementById("profile-photo");
      if (img) {
        img.src = photoSrc;
        img.alt = photoAlt;
      }

      var researchList = document.getElementById("research-list");
      (data.research_interests || []).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        researchList.appendChild(li);
      });

      var publicationsList = document.getElementById("publications-list");
      (data.publications || []).forEach(function (paper) {
        var li = document.createElement("li");
        li.className = "paper-item";

        if (paper.title) {
          var title = document.createElement("p");
          title.className = "paper-title";
          title.textContent = paper.title;
          li.appendChild(title);
        }

        if (paper.authors) {
          var authors = document.createElement("p");
          authors.className = "paper-authors";
          authors.textContent = paper.authors;
          li.appendChild(authors);
        }

        if (paper.venue || paper.year) {
          var venue = document.createElement("p");
          venue.className = "paper-venue";
          venue.textContent = [paper.venue, paper.year].filter(Boolean).join(", ") + ".";
          li.appendChild(venue);
        }

        if (paper.citation && !paper.title) {
          var citation = document.createElement("p");
          citation.className = "paper-citation";
          citation.textContent = paper.citation;
          li.appendChild(citation);
        }

        if (paper.note) {
          var note = document.createElement("p");
          note.className = "paper-note";
          note.textContent = paper.note;
          li.appendChild(note);
        }

        var linkItems = (paper.links || []).filter(function (link) {
          return link.url && link.url.trim().length > 0;
        });

        if (linkItems.length > 0) {
          var linkWrap = document.createElement("div");
          linkWrap.className = "paper-links";
          linkItems.forEach(function (link) {
            var a = createLink(link.url, toTitleCase(link.label || "Link"));
            a.className = linkClassByLabel(link.label);
            linkWrap.appendChild(a);
          });
          li.appendChild(linkWrap);
        }

        publicationsList.appendChild(li);
      });

      var contactList = document.getElementById("contact-list");
      (data.contacts || []).forEach(function (item) {
        var li = document.createElement("li");
        var label = document.createElement("strong");
        label.textContent = (item.label || item.text || "Contact") + ": ";
        li.appendChild(label);

        if (item.url && item.url.trim().length > 0) {
          li.appendChild(createLink(item.url, item.text || item.url));
        } else {
          var span = document.createElement("span");
          span.textContent = item.text || "Add link in site-data.json";
          li.appendChild(span);
        }

        contactList.appendChild(li);
      });
    })
    .catch(function (error) {
      console.error(error);
      setText("about-text", "Failed to load site configuration. Please check site-data.json.");
    });
})();
