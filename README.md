
### Creating new blog posts

You can either edit content locally and commit and push to your fork, or you can use GitHub's web editing functionality, which provides basic preview of Markdown files.
 
You may find it useful to learn about [Markdown syntax](http://daringfireball.net/projects/markdown/syntax).
   
NOTE: to build the entire site a [full Jekyll install](#installing-jekyll) is required. Blog post writers should not need to do this, although it may be useful to preview how your post will look.

Posts are held in the ```_posts``` folder.

To create a new post, create a file in this folder on GitHub directly. (Follow the naming format of the other files.)

#### Metadata
For new posts, ensure the correct metadata is added to the file header:

    layout: post  
    title: My Blog Post Title    
    description: A longer description that is used for SEO and social previews  
    category: My Category  
    author: my_name  
    tags: [Comma, Separated, Tags Can Have Multiple Words, In Square Brackets]  
    comments: true
    share: true

##### Categories
These will appear at the [categories page](http://wallies.github.io/categories/) and will also be part of the URL. Bear in mind these two guidelines:

* Enter the category as _sentence case_, such as __Open source__;
* If an acronym, enter it in ALL CAPS.

##### Tags
Although not explicitly shown to the end users, you can [view the tags page](http://wallies.github.io/tags/), to review tags others have used. The tagging system supplies the 'Related Posts' links you find at the bottom of a blog post. This provides an interesting and useful refinement to categories - at this time for example, there is only one blog post categorised as 'Testing', yet you will find four related posts at the bottom of the article.

##### Multiple authors
If a post is co-authored, use a collection for the author field:  

    author: [name_1, name_2]

#### Author data
If this is your first post, add yourself to the [authors file](https://github.com/wallies/wallies.github.io/blob/master/_data/authors.yml), following the pattern of one of the other authors.

    machine_name:
        name: Full Name
        twitter: mytwitterhandle
        github: mygithubhandle
        linkedin: http://uk.linkedin.com/in/my_linked_in_profile_full_url/en
        description: "Full Name is a Software Engineer, with an interest in Toys and robots."
        avatar: https://example.com/my_photo.jpg
        team: Drupal

Try to make the description field a little different from all the others.

#### Including images
Create a sub-directory in /images for your post, and add the image files in there. Ideally, optimise the images for the web, using a tool like [ImageOptim](https://imageoptim.com/) or [PNGCrush](http://pngcrush.com/). If you prefer, there's a [gulp task](https://github.com/wallies/wallies.github.io/blob/master/gulpfile.js) for that.

Then you can reference the image with markdown like this:

    ![alt text for the image](/images/subirectory/myimage.jpg)
    
If you want the image to be centred within the page, add the class "centered" like this:

    ![alt text for the image](/images/subirectory/myimage.jpg){: .centered }

#### Including videos

If you want your video to look nice on all screen sizes, here's some suggested markup:

    <div class="small-12 medium-4 small-centered columns">
      <div class="flex-video">
        <iframe width="640" height="360" src="https://www.youtube.com/embed/bKbOod8Pn4E" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
    
#### Pull quotes

To highlight a section of text in a pull quote, wrap it in a span with the class "pullquote" - it will be turned into a pull quote using JavaScript.
     
     Ordinary paragraph text <span class="pullquote">with pull quote inside</span> the main paragraph.

## Solving conflict / resync forks

1. git remote add upstream git@github.com:wallies/wallies.github.io.git
2. git pull upstream
3. git merge upstream/master
4. git merge master/[your-branch]


### Review checkpoints:

Blog maintainers will review posts for:

* Ensuring the post relates to the subject matter of the blog
* Client confidential information
* Anything which might put Redfog in a bad light
* Glaring grammatical/spelling errors

They will not:

* Change the tone of individual authors posts


## Installing Jekyll

[Instructions for installing Jekyll](http://jekyllrb.com/docs/installation/) (If you're running Windows, see the special section just for you below)

You can preview your changes by running jekyll serve --watch which will generate the site and run it at http://localhost:4000

## Code improvements

### Editing CSS
Github pages supports Sass, so just edit the .scss files in assets/css and Jekyll will take care of the rest - no need to commit any minified files.

### Running automated regression tests
Test scenarios for [BackstopJS](https://github.com/garris/BackstopJS) are defined in `backstop.json` - with your local Jekyll serving the site, run `gulp reference` before making any changes to generate reference screenshots. After making changes, run `gulp test` to compare the new version.  

### Editing Javascript
JS files are concatenated by Jekyll in assets/js/engblog.js, and gulp-uglify is used to minify them. The files are included in the page in _includes/scripts.html.
If you change any JS, run ```gulp compress``` and commit the resulting changes to engblog.min.js.
