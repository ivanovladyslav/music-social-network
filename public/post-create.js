const roles = [
  "Vocalist",
  "Songwriter",
  "Drummer",
  "Beatmaker",
  "Guitarist"
]

function addContributor() {
  var contributorBlock = $("<input type='text' name='contributors' placeholder='contributor name'>");
  var selectBlock = $("<select name='roles', placeholder='contributor role'>");
  var addContributorButton = $("#addContributorButton").detach();
  var temp = $(".contributors").append(contributorBlock);
  for (var i = 0; i < roles.length; i++) {
    selectBlock.append("<option value='"+roles[i]+"'>"+roles[i]+"</option>");
  }
  temp.append(selectBlock);
  $(".contributors").append(addContributorButton);
}
