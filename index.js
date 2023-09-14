document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const sortOptions = document.getElementById('sortOptions');
    const tagSearch = document.getElementById('tagSearch');
    const relateBtn = document.createElement('button');
    relateBtn.textContent = 'Relate Posts';
    relateBtn.id = 'relateBtn';
    document.body.appendChild(relateBtn);

    let relatedPosts = [];

    // Mock data for posts
    const posts = [
        { id: 1, title: 'Post 1', tags: ['tech', 'news'], likes: 10, dislikes: 2, date: new Date() },
        { id: 2, title: 'Post 2', tags: ['travel'], likes: 5, dislikes: 1, date: new Date() },
        // ... more mock posts
    ];

    // Generate posts dynamically
    function displayPosts(filteredPosts = posts) {
        main.innerHTML = '';
        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.dataset.id = post.id;
            postElement.innerHTML = `
                <input type='checkbox' class='relate-checkbox'>
                <h3>${post.title}</h3>
                <p>Tags: ${post.tags.join(', ')}</p>
                <button class='like-btn'>Like</button>
                <button class='dislike-btn'>Dislike</button>
                <p>Likes: <span class='like-count'>${post.likes}</span> | Dislikes: <span class='dislike-count'>${post.dislikes}</span></p>
            `;
            main.appendChild(postElement);
        });
    }

    displayPosts();

    // Like/Dislike functionality
    main.addEventListener('click', (e) => {
        if (e.target.classList.contains('like-btn') || e.target.classList.contains('dislike-btn')) {
            const postId = e.target.parentElement.dataset.id;
            const post = posts.find(p => p.id == postId);
            if (e.target.classList.contains('like-btn')) {
                post.likes++;
            } else {
                post.dislikes++;
            }
            displayPosts();
        }
    });

    // Sorting functionality
    sortOptions.addEventListener('change', () => {
        const value = sortOptions.value;
        if (value === 'ever') {
            posts.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
        } else {
            // For simplicity, I'm only implementing the 'ever' option for now.
            // Additional date-based sorting can be added later.
        }
        displayPosts();
    });

    // Tag searching functionality
    tagSearch.addEventListener('input', () => {
        const searchTerm = tagSearch.value.trim().toLowerCase();
        const filteredPosts = posts.filter(post => post.tags.some(tag => tag.includes(searchTerm)));
        displayPosts(filteredPosts);
    });

    // Relate posts functionality
    relateBtn.addEventListener('click', () => {
        const selectedPosts = [...document.querySelectorAll('.relate-checkbox:checked')].map(checkbox => checkbox.parentElement.dataset.id);
        if (selectedPosts.length >= 2) {
            relatedPosts.push(selectedPosts);
            displayRelatedPosts();
        }
    });

    function displayRelatedPosts() {
        const aside = document.querySelector('aside');
        aside.innerHTML = '<h2>Related Posts</h2>';
        relatedPosts.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'related-group';
            groupElement.dataset.related = group.join(',');
            groupElement.innerHTML = group.map(id => `<p>${posts.find(p => p.id == id).title}</p>`).join('');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove Relation';
            removeBtn.className = 'remove-relation-btn';
            groupElement.appendChild(removeBtn);
            aside.appendChild(groupElement);
        });
    }

    // Highlighting related posts
    document.querySelector('aside').addEventListener('click', (e) => {
        if (e.target.classList.contains('related-group')) {
            const relatedGroup = e.target;
            const postIds = relatedGroup.dataset.related.split(',');
            document.querySelectorAll('.post').forEach(post => {
                if (postIds.includes(post.dataset.id)) {
                    post.style.backgroundColor = '#e0e0e0'; // Highlight color
                } else {
                    post.style.backgroundColor = ''; // Reset color
                }
            });
        }
    });

    // Removing relation
    document.querySelector('aside').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-relation-btn')) {
            const relatedGroup = e.target.parentElement;
            const index = relatedPosts.findIndex(group => group.join(',') === relatedGroup.dataset.related);
            if (index !== -1) {
                relatedPosts.splice(index, 1);
                displayRelatedPosts();
            }
        }
    });
});
