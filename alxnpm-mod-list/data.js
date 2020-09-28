import Img from './alex.png'


export let data = {

    templateList: `

    <div class="list">
        <div class="alert-box" style="display:none">
            <a href="javascript:void(0)" onclick="this.parentElement.style.display = 'none'"><i class="fal fa-times"></i></a>
            <p></p>
            <div class="arrow-down"></div>
        </div>
        <table>
            <thead>
                <tr>
                <th>
                    <i data-sort="color" class="fas fa-palette"></i>
                </th>
                <th>
                    <i data-sort="icon" class="far fa-flag"></i>
                </th>
                <th style="text-align: left">
                    <i data-sort="title" class="fal fa-folder"></i>
                </th>
                <th>
                    <span data-sort="node" class="count-sort">Items</span>
                </th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    `,

    templateTreeView: `

    <div class="list">
        <div class="alert-box" style="display:none">
            <a href="javascript:void(0)" onclick="this.parentElement.style.display = 'none'"><i class="fal fa-times"></i></a>
            <p></p>
            <div class="arrow-down"></div>
        </div>
        <div class="treeview"></div>
    </div>

    `,
    
    header : `
    
    <ul>
        <li class="page-title"><span class="img"><img src="${Img}"/></span><span class="app-name">{appName}</span></li>
    </ul>
    
    `,

    footer : `
    
    <ul>
        <li class="add-item">
            <a href="javascript:void(0)"><i class="fal fa-folder-plus"></i></a>
        </li>
        <li class="logout">
            <a href="javascript:void(0)"><i class="fal fa-sign-out"></i></a>
        </li>
    </ul>
    
    `

}