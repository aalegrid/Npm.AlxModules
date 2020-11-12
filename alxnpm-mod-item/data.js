export let data = {

    template: `
    
    <div class="item">
    <div class="alert-box" style="display:none">
        <a onclick="this.parentElement.style.display = 'none'">
            <i class="fal fa-times"></i>
        </a>
        <p></p>
        <div class="arrow-down"></div>
    </div>
    <div class="page-chart"><canvas id="itemChart" height="150"></canvas></div>
    <div class="nodes-list">
        <div class="nodes-header">
            <h3 class="collapse">
                <a><i class="fal fa-minus-square"></i> {nodeName}s <span class="nodes-count"></span></a>
            </h3>
            <h3 class="filter-done" style="width:55%;text-align:right">
                <a><i class="fas fa-check-square"></i></a>
            </h3>           
            <h3 class="add-node"><a><i class="far fa-plus"></i></a></h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>
                        <a data-sort="title">Title</a>
                    </th>
                    <th class="priority">
                        <a data-sort="priority">Priority</a>
                    </th>
                    <th class="status">
                        <a data-sort="status">Status</a>
                    </th>
                    <th class="nodes">
                        <a data-sort="nodes">{nodeName}s</a>
                    </th>
                    <th class="control" style="text-align: right">
                        Control
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="notes-list">
        <div class="notes-header">
            <h3 class="collapse">
                <a><i class="fal fa-minus-square"></i> Notes <span class="notes-count"></span></a>
            </h3>
            <h3 class="add-note"><a><i class="far fa-plus"></i></a></h3>
        </div>
        <table>
            <tbody></tbody>
        </table>
    </div>
    <form method="post">
        <div class="row">
            <div class="col-25">
                <label for="title">Title</label>
            </div>
            <div class="col-75">
                <input type="text" name="title" id="title" />
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="description">Description</label>
            </div>
            <div class="col-75">
                <textarea name="description" id="description" rows="4"></textarea>
            </div>
        </div>
        <div class="row row-content">
            <div class="col-25">
                <label for="content">Content</label>
            </div>
            <div class="col-75">
                <textarea name="content" id="content" rows="10"></textarea>
            </div>
        </div>
        <div class="row row-datedue">
            <div class="col-25">
                <label for="dateDue">Due</label>
            </div>
            <div class="col-75">
                <input type="date" name="dateDue" id="dateDue" />
            </div>
        </div>
        <div class="row row-priority">
            <div class="col-25">
                <label>Priority</label>
            </div>
            <div class="col-75">
                <div class="priority-btn-group">
                    <a data-value="0"><i class="fal fa-info-circle"></i> Low</a>
                    <a data-value="1"><i class="fal fa-smile"></i> Medium</a>
                    <a data-value="2"><i class="fal fa-exclamation-triangle"></i> High</a>
                </div>
            </div>
        </div>
        <div class="row row-status">
            <div class="col-25">
                <label>Status</label>
            </div>
            <div class="col-75">
                <div class="status-btn-group">
                    <a data-value="0"><i class="far fa-square"></i> Todo</a>
                    <a data-value="1"><i class="far fa-clock"></i> In progress</a>
                    <a data-value="2"><i class="far fa-check-square"></i> Done</a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="icon">Icon</label>
            </div>
            <div class="col-75">
                <div class="input">
                    <input type="search" name="icon" id="icon" />
                    <a class="picker-trigger-icon" data-domain="icon"><i class="fal fa-flag"></i></a>
                </div>
                <div id="iconPicker" style="display:none;"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="color">Color</label>
            </div>
            <div class="col-75">
                <div class="input">
                    <input type="search" name="color" id="color" />
                    <a class="picker-trigger-color" data-domain="color"><span style="background-color: white;"></span></a>
                </div>
                <div id="colorPicker" style="display:none;"></div>
            </div>
        </div>
        <div class="row row-control">
            <div class="col-25">
                <label for="control">Control</label>
            </div>
            <div class="col-75">
                <input type="text" name="control" id="control" />
            </div>
        </div>
        <div class="row row-tag">
            <div class="col-25">
                <label for="tag">Tag</label>
            </div>
            <div class="col-75">
                <input type="text" name="tag" id="tag" />
            </div>
        </div>

        <div class="row">
            <button type="submit"><i class="fal fa-check"></i> Save</button>
        </div>
    </form>
</div>
    `,

    parentChooser: `
    

    <div class="col-25"><label>Parent</label></div>
    <div class="col-75" style="margin-bottom: 1rem;">
        <input type="hidden" name="parentId" id="parentId" value="">
        <div class="input-group" style="display: flex;">
                <input type="text" name="parent" id="parent" readonly="" value="">
                <a class="picker-trigger"><i class="fal fa-folder-tree"></i></a>
        </div>
        <div class="parent-dd"></div>
    </div>
 
    
    `,

    header: `
    
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

    footer: `
    
    <ul>
        <li class="home">
            <a><i class="fal fa-house-user"></i></a>
        </li>
        <li class="add-node">
            <a><i class=""></i></a>
        </li>
        <li class="add-note">
            <a><i class=""></i></a>
        </li>
        <li class="delete-item">
            <a><i class="fal fa-trash"></i></a>
        </li>
    </ul>
    
    `,

    floatingmenu: `
        <div class="floating-save-menu"><a><i class="fal fa-house-user"></i></a></div>
    
    `
}