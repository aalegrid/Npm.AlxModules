
export let data = {

    template: `

    <div class="login-form">
    <h3>Login</h3>
    <div class="alert-box" style="display:none">
        <a href="javascript:void(0)" onclick="this.parentElement.style.display = 'none'"><i class="fal fa-times"></i></a>
        <p></p>
        <div class="arrow-down"></div>
    </div>
    <form method="post">

        <div class="row">
            <div class="col-25">
                <label for="email">Email</label>
            </div>
            <div class="col-75">
                <input type="email" name="email" id="email" />
            </div>
        </div>

        <div class="row">
            <div class="col-25">
                <label for="password">Password</label>
            </div>
            <div class="col-75">
                <input type="password" name="password" id="password" />
            </div>
        </div>

        <div class="row">
            <button type="submit"><i class="fal fa-sign-in"></i> Sign-in</button>
        </div>

    </form>

  </div   

    `,

    header : `
    
    <ul>
        <li class="page-title">{appName}</li>
    </ul>

    `,

    footer : `

    <ul>
        <li class="copy">&copy; {appName}</li>
    </ul>

    `

}