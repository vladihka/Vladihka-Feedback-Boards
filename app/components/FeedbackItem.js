export default function FeedbackItem(){
    return (
        <div className="my-8 flex gap-8 items-center">
          <div>
            <h2 className="font-bold">Please post more videos</h2>
              <p className="text-gray-600 text-sm">Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. 
            Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia</p>
          </div>
          <div>
            <button className="shadow-sm shadow-gray-300 border rounded-md py-1 px-4 flex items-center gap-1 text-gray-600">
              <span className="triangle-vote-up"></span>
              80
            </button>
          </div>
        </div>
    )
}