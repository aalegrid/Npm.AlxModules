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
            <div class="meta-media-view"></div>         
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
                    <textarea name="value" id="value" rows="12" style="height:unset;"></textarea>
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

            <div class="row media-row" style="display:none">
                <span class="filename"></span>
                <div class="meta-media-form" style="margin-top:.3rem"></div>  
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


    itemChooser: `
    

    <div class="col-25"><label>Item</label></div>
    <div class="col-75" style="margin-bottom: 1rem;">
        <input type="hidden" name="itemId" id="itemId" value="">
        <div class="input-group" style="display: flex;">
                <input type="text" name="item" id="item" readonly="" value="">
                <a class="picker-trigger"><i class="fal fa-folder-tree"></i></a>
        </div>
        <div class="parent-dd"></div>
    </div>
 
    
    `,


    footer : `
    
    <ul>
        <li class="home">
            <a><i class="fal fa-house-user"></i></a>
        </li>
        <li class="edit">
            <a><i class="fal fa-edit"></i></a>
        </li>
        <li class="camera">
            <a><i class="fad fa-camera-retro"></i></a>
        </li>
        <!-- <li class="video">
            <a><i class="fad fa-camcorder"></i></a>
        </li> -->
        <li class="delete-note">
            <a><i class="fal fa-trash"></i></a>
        </li>

    </ul>
    
    `
}