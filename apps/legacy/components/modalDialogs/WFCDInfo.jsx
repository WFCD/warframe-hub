export default function WFCDInfo() {
  return (
    <div className="modal fade" id="wfcd" tabIndex="-1" role="dialog" aria-labelledby="wfcdLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button name="Dismiss Modal" type="button" className="close" data-dismiss="modal" aria-hidden="true">
              &times;
            </button>
            <h4 className="modal-title">Warframe Community Developers</h4>
          </div>
          <div className="modal-body">
            This project is part of the Warframe Community Developers.
            <br />
            <a name="Warframe Hub Github" href="https://github.com/WFCD/warframe-hub" rel="noopener" target="_blank">
              Click here to view GitHub project.
            </a>
            <br />
            <br />
            <a name="Warframe Comm Dev Github" rel="noopener" target="_blank" href="https://github.com/WFCD">
              <img
                className="wfcd-banner img-rounded"
                style="padding: 10px 10px 10px 10px"
                src="https://warframestat.us/wfcd.png"
                alt="WFCD Logo"
              />
            </a>
            <br />
            <br />
            Pull requests are welcome, please submit any issues found to the project's
            <a name="Hub Issues" rel="noopener" target="_blank" href="https://github.com/WFCD/warframe-hub/issues">
              issue tracker{' '}
            </a>
            .
          </div>
          <div className="modal-footer">
            <button
              name="Dismiss Modal"
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              style="cursor: pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
