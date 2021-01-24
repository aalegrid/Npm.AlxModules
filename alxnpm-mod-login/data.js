import Img from './alex.png'

export let data = {

    template: `

    <div class="login-form">

    <div class="alert-box" style="display:none">
        <a href="javascript:void(0)" onclick="this.parentElement.style.display = 'none'"><i
                class="fal fa-times"></i></a>
        <p></p>
        <div class="arrow-down"></div>
    </div>
    <form method="post">

        <fieldset>
            <legend>Login</legend>
            <div class="row">
                <div class="col-25">
                    <label for="email">Email</label>
                </div>
                <div class="col-75">
                    <input data-name="Email" type="email" name="email" id="email" />
                </div>
            </div>

            <div class="row row-password">
                <div class="col-25">
                    <label for="password">Password</label>
                </div>
                <div class="col-75">
                    <input data-name="Password" type="password" name="password" id="password" />
                </div>
            </div>

            <div class="signup-fields" style="display:none">
                <div class="row">
                    <div class="col-25">
                        <label for="confirmpassword">Confirm Password</label>
                    </div>
                    <div class="col-75">
                        <input data-name="Confirm Password" type="password" name="confirmpassword"
                            id="confirmpassword" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-25">
                        <label for="firstname">First Name</label>
                    </div>
                    <div class="col-75">
                        <input data-name="First Name" type="text" name="firstname" id="firstname" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-25">
                        <label for="lastname">Last Name</label>
                    </div>
                    <div class="col-75">
                        <input data-name="Last Name" type="text" name="lastname" id="lastname" />
                    </div>
                </div>

            </div>

            <div class="signup">
                <div class="row">
                    <button class="signin-button"><i class="fal fa-sign-in"></i> Sign in</button>
                </div>
                <div>No account? <a data-button="signup">Sign-up</a></div>
                <div>Forgot your password? <a data-button="reset">Reset password</a></div>
            </div>

            <div class="signin" style="display:none">
                <div class="row">
                    <button class="signup-button"><i class="fal fa-user-plus"></i> Sign up</button>
                </div>
                <div style="font-size:.9rem; margin:.5rem 0;">By clicking Sign Up, you agree to our <a target="_blank" href="https://www.alxwebworks.com/Home/Privacy">Privacy Policy</a> and <a target="_blank" href="https://www.alxwebworks.com/Home/TermsAndConditions">Terms and Conditions</a>.</div>
                <div>Already have an account? <a class="signin-link">Sign-in</a></div>
            </div>

            <div class="reset" style="display:none">
                <div class="row">
                    <button class="reset-button"><i class="far fa-unlock-alt"></i> Send Password Link</button>
                </div>
                <div>Already have an account? <a>Sign-in</a></div>
            </div>

        </fieldset>

    </form>

    </div

    `,

    header : `
    
    <ul>
        <li class="page-title">
            <span class="app-name">{appName}</span>
        </li>
    </ul>

    `,

    footer : `

    <ul>
        <li class="copy">&copy; {appName}</li>
    </ul>

    `

}