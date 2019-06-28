const roles = [
  "Vocalist",
  "Songwriter",
  "Drummer",
  "Beatmaker",
  "Guitarist",
  "Producer",
  "Graphic designer",
  "Manager",
  "Photographer",
  "Creative director",
  "Mixing engineer",
  "Filmmaker",
]

function addContributor() {
  var contributorBlock = $("<input class='form-control' type='text' name='contributors' placeholder='contributor name'>");
  var selectBlock = $("<select class='custom-select custom-select-sm mb-3' name='roles' placeholder='contributor role'>");
  var addContributorButton = $("#addContributorButton").detach();
  var temp = $(".contributors").append(contributorBlock);
  for (var i = 0; i < roles.length; i++) {
    selectBlock.append("<option value='"+roles[i]+"'>"+roles[i]+"</option>");
  }
  temp.append(selectBlock);
  $(".contributors").append(addContributorButton);
}
