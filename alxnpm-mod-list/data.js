import Img from './alex.png'
import List from './script';


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
                    <a data-sort="color"><i class="fas fa-palette reverse"></i></a>
                </th>
                <th>
                    <a data-sort="icon"><i class="fab fa-font-awesome-flag"></i></a>
                </th>
                <th style="text-align: left">
                    <a data-sort="title"><i class="fas fa-folder"></i></a>
                </th>
                <th>
                    <a class="count-sort" data-sort="node"><i class="fad fa-copy"></i></a>
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

    header: `
    
    <ul>
        <li class="page-title"><span class="app-name">{appName}</span></li>
    </ul>
    
    `,

    footer: `
    
    <ul>
        <li class="add-item">
            <a href="javascript:void(0)"><i class="fal fa-folder-plus"></i></a>
        </li>
        <li class="refresh">
            <a href="javascript:void(0)"><i class="fal fa-sync"></i></a>
        </li>
        <li class="logout">
            <a href="javascript:void(0)"><i class="fal fa-sign-out"></i></a>
        </li>
    </ul>
    
    `,
    links : {
        project: [`<li class="sort-todo"><a data-sort="todo"><i class="fal fa-sort-size-up"></i></a></li>`],


    }

}