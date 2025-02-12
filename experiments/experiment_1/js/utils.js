
/*
 * Util functions
 */


function logToBrowser(ctx, variable) {
    if (VERBOSE) {
        if (variable) {
            console.log('\t', ctx, ': ', variable);
        }
        else {
            console.log(ctx);
        }
    }
}