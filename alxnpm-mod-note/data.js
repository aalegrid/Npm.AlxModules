export let data = {

    template: `
    
    <div class="note view">

        <div class="alert-box" style="display:none">
            <a href="javascript:void(0)" onclick="this.parentElement.style.display = 'none'"><i
                    class="fal fa-times"></i></a>
            <p></p>
            <div class="arrow-down"></div>
        </div>
     
        <div class="view">
            <div class="name"></div>
            <div class="value"></div>
            <img src="" class="binary-data-view img-responsive meta-image" />
        </div>

        <form method="post">

            <div class="row">
                <div class="col-25">
                    <label for="name">Name</label>
                </div>
                <div class="col-75">
                    <input type="text" name="name" id="name" />
                </div>
            </div>

            <div class="row">
                <div class="col-25">
                    <label for="value">Value</label>
                </div>
                <div class="col-75">
                    <textarea name="value" id="value" rows="8" style="height:unset;"></textarea>
                </div>
            </div>

            <div class="row button-row">
                <a class="clear-binary"><i class="fal fa-times"></i> Clear</a>
                <label class="custom-file-upload">
                    <input type="file" class="attach-file" />
                    <i class="far fa-upload"></i> Upload File
                </label>
                <button type="submit"><i class="fal fa-check"></i> Save</button>

            </div>

            <div class="row image-row" style="display:none">
                <span class="filename"></span>
                <img src="" class="binary-data img-responsive meta-image" />
            </div>

        </form>


    </div>
    `,

    header : `
    
        <ul>
            <li class="back">
                <a><i class="fal fa-arrow-left"></i></a>
            </li>
            <li class="page-title"></li>
            <li class="save">
                <a><i class="fal fa-save"></i></a>
            </li>

        </ul>
    
    `,

    footer : `
    
    <ul>
        <li class="home">
            <a><i class="fal fa-house-user"></i></a>
        </li>
        <li class="edit">
            <a><i class="fal fa-edit"></i></a>
        </li>
        <li class="delete-note">
            <a><i class="fal fa-trash"></i></a>
        </li>

    </ul>
    
    `
}